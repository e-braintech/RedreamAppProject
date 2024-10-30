// 문자열을 Base64로 인코딩하는 함수
export const encodeToBase64 = (data: string): string => {
  return Buffer.from(data).toString('base64');
};

// Base64로 인코딩된 문자열을 디코딩하는 함수
export const decodeFromBase64 = (data: string): string => {
  return atob(data);
};

// 10진수 아스키 코드 값으로 변환하는 함수
export const charToDecimal = (char: string) => {
  return char.charCodeAt(0);
};

// // 특정 위치의 문자를 10진수 ASCII 값으로 변환하는 함수
// export const getAsciiValue = (decodedValue: string, char: string) => {
//   const index = decodedValue.indexOf(char);
//   if (index !== -1) {
//     return charToDecimal(decodedValue[index]);
//   }
//   return null; // 문자가 없을 경우 null 반환
// };
