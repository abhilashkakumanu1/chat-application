// Types
const age: number = 32; // const age = 32 - implicit inference
const myName: string = "Shahid";
const isMale: boolean = true;

// Function Defs
function isAdult(age: number): boolean {
  return age >= 18;
}

// Enums - enumeration
enum Gender {
  MALE = "male",
  FEMALE = "female",
  NON_BINARY = "non-binary",
}

// Interfaces & Types - OOPs
// interface is like a custom DataType - and it doesn't have functionality on it (unlike class)
interface IHuman {
  name: string;
  age: number;
  gender?: Gender;
}

function printHuman(human: IHuman): void {
  const { name, age, gender } = human;
  console.log(
    `Name - ${name}\nAge - ${age}${gender ? "\nGender - " + gender : ""}`
  );
}
const shahid: IHuman = { name: "Shahid", age: 25, gender: Gender.MALE };
printHuman(shahid);

// Composition of types
type mixed = string | number;
const t1: mixed = "1";
const t2: mixed = 1;
// const t3: mixed = true;

// Compound Data types
// Arrays
const numbers: number[] = [1, 2, 3];
const numbersOrString: Array<number | string> = [];

// Clean code is better implemented in OOP languages. TS helps in adding some OOPs concepts to JS like interface
