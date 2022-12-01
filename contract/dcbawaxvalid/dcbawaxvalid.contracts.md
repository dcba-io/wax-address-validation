<h1 class="contract">request</h1>

---

spec_version: "0.2.0"
title: Starting Validation
summary: 'Start a new validation with the unique code and targeted wax address'
icon: @ICON@

---

This is called by the oracle's backend. RAM is paid by the project.

If the unique code provided exists, it can be reused with a different wax address. This will restart the process and previous validation record will be invalidated.

<h1 class="contract">validate</h1>

---

spec_version: "0.2.0"
title: Validating
summary: 'The user validates their address'
icon: @ICON@

---

This is a frontend action signed by the user. The code and the address are provided, the address' sign is checked.

This action can be also called by the project backend for any user.

<h1 class="contract">remove</h1>

---

spec_version: "0.2.0"
title: Remove Validation
summary: 'Remove the row in the valids table'
icon: @ICON@

---

This may be used to free the RAM by the project backend.

Keeping the data on-chain can serve to check the validations by third parties.
