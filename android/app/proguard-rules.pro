# Add project specific ProGuard rules here.
# https://developer.android.com/guide/developing/tools/proguard.html

# React Native / Hermes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
}
-keep @com.facebook.react.bridge.ReactMethod class * { *; }

# Reanimated / gesture-handler
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.gesturehandler.** { *; }

# Kakao SDK (@react-native-kakao)
-keep class com.kakao.** { *; }
-keep class com.kakao.sdk.** { *; }
-dontwarn com.kakao.**

# Naver Login
-keep public class com.navercorp.nid.** { *; }

# react-native-video / ExoPlayer
-keep class com.brentvatne.** { *; }
-keep class androidx.media3.** { *; }

# react-native-maps
-keep class com.google.android.gms.maps.** { *; }
-keep class com.rnmaps.maps.** { *; }

# Retrofit / OkHttp (Kakao 등)
-keepattributes Signature, InnerClasses, EnclosingMethod
-keepattributes RuntimeVisibleAnnotations, RuntimeVisibleParameterAnnotations
-keepclassmembers,allowshrinking,allowobfuscation interface * {
    @retrofit2.http.* <methods>;
}
-dontwarn org.bouncycastle.jsse.**
-dontwarn org.conscrypt.*
-dontwarn org.openjsse.**
