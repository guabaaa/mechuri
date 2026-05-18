import { Component, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import type { NearbyPlace } from '../api/types';
import { colors } from '../theme';
import { fonts } from '../theme/typography';

class MapErrorBoundary extends Component<
  { children: ReactNode; height: number },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <View style={[styles.wrap, styles.mapError, { height: this.props.height }]}>
          <Text style={styles.mapErrorText}>지도를 불러오지 못했어요</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

type Props = {
  userLat: number;
  userLng: number;
  places?: NearbyPlace[];
  height?: number;
};

export default function NearbyMap({
  userLat,
  userLng,
  places = [],
  height = 220,
}: Props) {
  const region = {
    latitude: userLat,
    longitude: userLng,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  };

  return (
    <View style={[styles.wrap, { height }]}>
      <MapErrorBoundary height={height}>
        <MapView
          style={StyleSheet.absoluteFill}
          provider={PROVIDER_DEFAULT}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton={false}
          toolbarEnabled={false}>
          {places
            .filter((p) => p.lat != null && p.lng != null)
            .map((place) => (
              <Marker
                key={`${place.name}-${place.lat}-${place.lng}`}
                coordinate={{ latitude: place.lat!, longitude: place.lng! }}
                title={place.name}
                description={place.address}
                pinColor={colors.orange}
              />
            ))}
        </MapView>
      </MapErrorBoundary>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.tileBorder,
    backgroundColor: colors.cream,
  },
  mapError: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  mapErrorText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.taupe,
  },
});
