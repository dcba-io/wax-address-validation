#include <boost/test/unit_test.hpp>
#include <eosio/testing/tester.hpp>
#include <eosio/chain/abi_serializer.hpp>
// #include "eosio.system_tester.hpp"
#include "contracts.hpp"

#include "Runtime/Runtime.h"
#include <fc/variant_object.hpp>

using namespace eosio::testing;
using namespace eosio;
using namespace eosio::chain;
using namespace eosio::testing;
using namespace fc;
using namespace std;

using mvo = fc::mutable_variant_object;

class dcbawaxvalid_tester : public tester {
public:

   dcbawaxvalid_tester() {
      produce_blocks( 2 );

      create_accounts( { name("alice"), name("bob"), name("dcbawaxvalid") } );
      produce_blocks( 2 );

      set_code( name("dcbawaxvalid"), contracts::token_wasm() );
      set_abi( name("dcbawaxvalid"), contracts::token_abi().data() );

      produce_blocks();

      const auto& accnt = control->db().get<account_object,by_name>( name("dcbawaxvalid") );
      abi_def abi;
      BOOST_REQUIRE_EQUAL(abi_serializer::to_abi(accnt.abi, abi), true);
      abi_ser.set_abi(abi, abi_serializer::create_yield_function(abi_serializer_max_time));
   }

   action_result push_action( const account_name& signer, const action_name &actionName, const variant_object &data ) {
      string action_type_name = abi_ser.get_action_type(actionName);

      action act;
      act.account = name("dcbawaxvalid");
      act.name    = actionName;
      act.data    = abi_ser.variant_to_binary( action_type_name, data, abi_serializer::create_yield_function(abi_serializer_max_time) );

      return base_tester::push_action( std::move(act), signer.to_uint64_t() );
   }

   fc::variant get_valids( const uint64_t& code )
   {
      vector<char> data = get_row_by_account( name("dcbawaxvalid"), name("dcbawaxvalid"), name("valids"), account_name(code) );
      return data.empty() ? fc::variant() : abi_ser.binary_to_variant( "validations", data, abi_serializer::create_yield_function(abi_serializer_max_time) );
   }

   action_result request_validation(uint64_t code, account_name address, account_name caller) {
      return push_action( caller, name("request"), mvo()
           ( "code", code)
           ( "address", address)
      );
   }

   action_result validate(uint64_t code, account_name address, account_name caller) {
      return push_action( caller, name("validate"), mvo()
           ( "code", code)
           ( "address", address)
      );
   }

   action_result remove_validation(uint64_t code, account_name caller) {
      return push_action( caller, name("remove"), mvo()
           ( "code", code)
      );
   }

   abi_serializer abi_ser;
};

BOOST_AUTO_TEST_SUITE(dcbawaxvalid_tests)

BOOST_FIXTURE_TEST_CASE( require_auth_request_validation, dcbawaxvalid_tester ) try {

   BOOST_REQUIRE_EQUAL( wasm_assert_msg( "Require auth missing" ),
      request_validation( 1, name("alice"), name("alice"))
   );

} FC_LOG_AND_RETHROW()

BOOST_FIXTURE_TEST_CASE( registered_but_not_validated, dcbawaxvalid_tester ) try {

   request_validation( 1, name("alice"), name("dcbawaxvalid"));
   auto valids = get_valids(1);
   REQUIRE_MATCHING_OBJECT( valids, mvo()
      ("code", 1)
      ("address", name("alice"))
      ("success", 0)
   );
   produce_blocks(1);

   BOOST_REQUIRE_EQUAL( wasm_assert_msg( "Validation is registered but not-validated" ),
                        request_validation( 1, name("dcbawaxvalid"), name("alice"))
   );

} FC_LOG_AND_RETHROW()

BOOST_FIXTURE_TEST_CASE( require_auth_validate, dcbawaxvalid_tester ) try {

   BOOST_REQUIRE_EQUAL( wasm_assert_msg( "Require auth missing" ),
      validate( 1, name("alice"), name("bob"))
   );

} FC_LOG_AND_RETHROW()

BOOST_FIXTURE_TEST_CASE( validation_record_not_exist, dcbawaxvalid_tester ) try {

   BOOST_REQUIRE_EQUAL( wasm_assert_msg( "Validation record does not exist." ),
      validate( 2, name("bob"), name("bob"))
   );

} FC_LOG_AND_RETHROW()

BOOST_FIXTURE_TEST_CASE( address_not_match, dcbawaxvalid_tester ) try {

   request_validation( 1, name("alice"), name("dcbawaxvalid"));
   BOOST_REQUIRE_EQUAL( wasm_assert_msg( "Validation information is not correct." ),
      validate( 1, name("bob"), name("bob"))
   );

} FC_LOG_AND_RETHROW()

BOOST_FIXTURE_TEST_CASE( registered_and_validated, dcbawaxvalid_tester ) try {

   request_validation( 1, name("alice"), name("dcbawaxvalid"));
   validate( 1, name("alice"), name("alice"));
   auto valids = get_valids(1);
   REQUIRE_MATCHING_OBJECT( valids, mvo()
      ("code", 1)
      ("address", name("alice"))
      ("success", 1)
   );
   produce_blocks(1);

   BOOST_REQUIRE_EQUAL( wasm_assert_msg( "Validation is registered and validated" ),
                        request_validation( 1, name("dcbawaxvalid"), name("alice"))
   );

} FC_LOG_AND_RETHROW()

BOOST_FIXTURE_TEST_CASE( require_auth_remove_validation, dcbawaxvalid_tester ) try {

   BOOST_REQUIRE_EQUAL( wasm_assert_msg( "Require auth missing" ),
      remove_validation( 1, name("alice"))
   );

} FC_LOG_AND_RETHROW()

BOOST_FIXTURE_TEST_CASE( remove_validation_record_not_found, dcbawaxvalid_tester ) try {

   BOOST_REQUIRE_EQUAL( wasm_assert_msg( "Validation record does not exist." ),
      remove_validation( 2, name("dcbawaxvalid"))
   );

} FC_LOG_AND_RETHROW()

BOOST_FIXTURE_TEST_CASE( remove_validation_success, dcbawaxvalid_tester ) try {

  request_validation( 1, name("alice"), name("dcbawaxvalid"));
  remove_validation( 1, name("dcbawaxvalid"));
  auto valids = get_valids(1);
  REQUIRE_MATCHING_OBJECT( valids, mvo() );
  produce_blocks(1);

} FC_LOG_AND_RETHROW()

BOOST_AUTO_TEST_SUITE_END()
