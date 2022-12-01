#pragma once
#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>

using namespace eosio;

// Game data by templates

struct [[eosio::contract("dcbawaxvalid"), eosio::table]] valid
{
    uint64_t code;
    name address;
    uint8_t success;

    uint64_t primary_key() const { return code; };
};

using valids = multi_index<name("valids"), valid>;
