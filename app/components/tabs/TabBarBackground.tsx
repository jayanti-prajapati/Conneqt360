// components/TabBarBackground.tsx
import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const TabBarBackground = () => {
    return (
        <View style={{ position: 'absolute', bottom: 0 }}>
            <Svg width="100%" height={80} viewBox="0 0 400 80">
                <Path
                    d="M0 0 H150 C170 0 180 40 200 40 C220 40 230 0 250 0 H400 V80 H0 Z"
                    fill="white"
                    stroke="#f0f0f0"
                />
            </Svg>
        </View>
    );
};

export default TabBarBackground;
