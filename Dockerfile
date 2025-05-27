#FROM reactnativecommunity/react-native-android
FROM encape/react-native-arm64:1.0.6

WORKDIR /usr/app

COPY ./ ./

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
RUN mkdir -p ./artifacts
RUN eas build \
  --platform android \
  --profile production \
  --local \
  --output ./artifacts/app.aab \
  --non-interactive
