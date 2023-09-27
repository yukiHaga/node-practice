const helloWorld = "Hello World";
console.log(helloWorld);

export const hello_tmp = (name: string) => {
  // eslintのprefer-templateルールに引っかかる
  // prefer-templateルールは、文字列連結の代わりにテンプレート・リテラルを必要とするルール
  console.log(`Hello World${name}`);
};
