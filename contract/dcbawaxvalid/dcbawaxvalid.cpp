#include "dcbawaxvalid.hpp"

dcbawaxvalid::dcbawaxvalid(name receiver, name code, datastream<const char *> ds)
  : contract::contract(receiver, code, ds)
{
}

void dcbawaxvalid::request_validation(const uint64_t& code, const name& address){
  check(has_auth(get_self()), "Require auth missing");

  valids _valids(get_self(), get_self().value);
  auto itr = _valids.find(code);

  if(itr != _valids.end() && itr->address == address){
    check(itr->success == 0, "Validation is registered and validated");
    check(itr->success == 1, "Validation is registered but not-validated");
  }

  if(itr == _valids.end()){
    _valids.emplace(get_self(), [&](auto &a) {
      a.code = code;
      a.address = address;
      a.success = 0;
    });
  }else{
    _valids.modify(itr, same_payer, [&](auto &a) {
      a.address = address;
      a.success = 0;
    });
  }
}

void dcbawaxvalid::validate(const uint64_t& code, const name& address){
  check(has_auth(address) || has_auth(get_self()), "Require auth missing");

  valids _valids(get_self(), get_self().value);
  auto itr = _valids.find(code);

  check(itr != _valids.end(), "Validation record does not exist.");
  check(address == itr->address, "Validation information is not correct.");

  _valids.modify(itr, same_payer, [&](auto &a) {
    a.success = 1;
  });
}

void dcbawaxvalid::remove_validation(const uint64_t& code){
  check(has_auth(get_self()), "Require auth missing");

  valids _valids(get_self(), get_self().value);
  auto itr = _valids.find(code);

  check(itr != _valids.end(), "Validation record does not exist.");

  _valids.erase(itr);
}
