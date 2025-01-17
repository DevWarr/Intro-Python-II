import { createSpyAndMock } from "./src/utils/testFunction";

const o1 = {
  myFunc: () => "hello",
  prop: 12,
};
console.log("=== BEFORE MOCKING===");
console.log(o1.myFunc);
console.log(o1.myFunc());
console.log(o1.myFunc.calls);
createSpyAndMock(o1, "myFunc");

console.log("\n\n=== SPYING ===");
console.log(o1.myFunc);
console.log(o1.myFunc());
console.log(o1.myFunc.calls);
console.log(o1.myFunc());
console.log(o1.myFunc.calls);
o1.myFunc.resetMethod();

console.log("\n\n=== MOCKING AND SPYING ===");
createSpyAndMock(o1, "myFunc");
o1.myFunc.setReturnValue("yo yo ma");

console.log(o1.myFunc);
console.log(o1.myFunc());
console.log(o1.myFunc.calls);
console.log(o1.myFunc());
console.log(o1.myFunc.calls);

import guardianUtils, { addition } from "./src/models/guardianUtils";

console.log("\n\n");
console.log(addition);
createSpyAndMock(guardianUtils, "addition");
console.log(addition);
console.log(addition.calls);
addition.setReturnValue(24);
console.log(addition);
console.log(addition(123));
console.log(addition.calls);
console.log(addition.lastCalledWith);
