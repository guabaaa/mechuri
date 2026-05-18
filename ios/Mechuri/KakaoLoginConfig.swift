/// auth.local.ts 의 kakao.nativeAppKey 와 동일하게 유지
enum KakaoLoginConfig {
  static let nativeAppKey = "438d85132fe878dc3fa822535a2d772b"
  static var urlScheme: String { "kakao\(nativeAppKey)" }
}
