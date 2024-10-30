// 문자열을 Base64로 인코딩하는 함수
export const encodeToBase64 = (data: string): string => {
  return Buffer.from(data).toString('base64');
};

// Base64로 인코딩된 문자열을 디코딩하는 함수
export const decodeFromBase64 = (data: string): string => {
  return Buffer.from(data, 'base64').toString('ascii');
};
