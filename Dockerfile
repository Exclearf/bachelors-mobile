#FROM reactnativecommunity/react-native-android
FROM encape/react-native-arm64:1.0.6

WORKDIR /usr/app

COPY ./ ./

RUN ln -s /opt/android/platforms/android-36 /opt/android/platforms/android-35

RUN sed -i 's/^Pkg\.Revision=36\.0\.0$/Pkg.Revision=35.0.0/' /opt/android/build-tools/35.0.0/source.properties

RUN sed -i 's/^Pkg.Desc=.*/Pkg.Desc=Android SDK Platform 35/; s/^Platform.Version=.*/Platform.Version=35/; s/^Layoutlib.Api=.*/Layoutlib.Api=35/; s/^Pkg.Revision=.*/Pkg.Revision=1/' /opt/android/platforms/android-35/source.properties

RUN sed -i \
  -e 's|path="platforms;android-36"|path="platforms;android-35"|g' \
  -e 's|<api-level>36</api-level>|<api-level>35</api-level>|g' \
  -e 's|<display-name>Android SDK Platform 36</display-name>|<display-name>Android SDK Platform 35</display-name>|g' \
  /opt/android/platforms/android-35/package.xml

RUN sed -i \
  -e 's#<localPackage path="build-tools;[0-9]\+\.[0-9]\+\.[0-9]\+"#<localPackage path="build-tools;35.0.0"#' \
  -e 's#<major>[0-9]\+</major>#<major>35</major>#' \
  -e 's#<display-name>Android SDK Build-Tools [0-9]\+</display-name>#<display-name>Android SDK Build-Tools 35</display-name>#' \
  /opt/android/build-tools/35.0.0/package.xml

RUN mv /opt/android/ndk/27.1.12297006/toolchains/llvm/prebuilt/linux-x86_64/lib/clang/21 /opt/android/ndk/27.1.12297006/toolchains/llvm/prebuilt/linux-x86_64/lib/clang/21.backup

RUN ln -s /opt/android/ndk/27.1.12297006/toolchains/llvm/prebuilt/linux-x86_64/lib/clang/20 /opt/android/ndk/27.1.12297006/toolchains/llvm/prebuilt/linux-x86_64/lib/clang/21

RUN rsync -a --remove-source-files /opt/android/ndk/27.1.12297006/toolchains/llvm/prebuilt/linux-x86_64/lib/clang/21.backup/include/ /opt/android/ndk/27.1.12297006/toolchains/llvm/prebuilt/linux-x86_64/lib/clang/20/include/

#RUN sed -i 's/__builtin_neon___a64_vcvtq_low_bf16_f32/__builtin_neon_vcvtq_low_bf16_f32/g' /opt/android/ndk/27.1.12297006/toolchains/llvm/prebuilt/linux-x86_64/lib/clang/20/include/arm_neon.h

ARG EXPO_TOKEN
ARG KEYSTORE_PASSWORD
ARG KEY_PASSWORD
ARG KEY_ALIAS

RUN npm install -g expo-cli eas-cli

ENV EXPO_TOKEN=${EXPO_TOKEN} \
  EXPO_ANDROID_KEYSTORE_PATH=/usr/app/keys/release-key.jks \
  EXPO_ANDROID_KEYSTORE_PASSWORD=${KEYSTORE_PASSWORD} \
  EXPO_ANDROID_KEY_PASSWORD=${KEY_PASSWORD} \
  EXPO_ANDROID_KEY_ALIAS=${KEY_ALIAS}

RUN npm ci --force

RUN eas build \
  --platform android \
  --profile production \
  --local \
  --non-interactive
