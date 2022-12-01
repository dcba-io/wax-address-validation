cmake_minimum_required( VERSION 3.5 )

project(dcbawaxvalid)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

if(${BUILD_TESTS})
    add_definitions(-DDEBUG)
endif()

add_contract(dcbawaxvalid dcbawaxvalid
dcbawaxvalid.cpp
)

target_compile_options( dcbawaxvalid PUBLIC -R${CMAKE_CURRENT_SOURCE_DIR} -R${CMAKE_CURRENT_BINARY_DIR} )

include_directories(
${CMAKE_CURRENT_SOURCE_DIR})
