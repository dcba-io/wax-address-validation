#include <eosio/eosio.hpp>
#include "valids.hpp"

using namespace eosio;

class [[eosio::contract("dcbawaxvalid")]] dcbawaxvalid : public contract
{

public:
  dcbawaxvalid(name receiver, name code, datastream<const char *> ds);

  [[eosio::action("request")]] void request_validation(const uint64_t& code, const name& address);
  [[eosio::action("validate")]] void validate(const uint64_t& code, const name& address);

  [[eosio::action("remove")]] void remove_validation(const uint64_t& code);


};
