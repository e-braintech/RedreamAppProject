// 바이트 배열을 Base64로 인코딩하는 함수
export const encodeToBase64 = (byteArray: number[]): string => {
  // 바이트 배열을 Uint8Array로 변환
  const uint8Array = new Uint8Array(byteArray);

  // Uint8Array를 문자열로 변환 (TextEncoder 사용)
  let binaryString = '';
  uint8Array.forEach(byte => {
    binaryString += String.fromCharCode(byte);
  });

  // Base64로 인코딩
  return btoa(binaryString);
};
