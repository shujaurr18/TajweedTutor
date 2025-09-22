import React from 'react';
import { View, Alert, Image } from 'react-native';
import { Wrapper, Text, Headers, Buttons, Spacer } from '../../../components';
import { useHooks } from './hooks';
import { colors, responsiveFontSize, responsiveHeight } from '../../../services';
import { useAuth } from '../../../services/contexts/AuthContext';

export default function Index() {
    const { loading, handleLogout } = useHooks();
    const { user } = useAuth();

    return (
        <Wrapper isMain>
            <Headers.Primary title="Account" />
            <Wrapper marginHorizontalBase>
                <Spacer isDoubleBase />
                
                {/* User Info Section */}
                <Wrapper alignItemsCenter>
                    <View style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: colors.appColor2,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 15
                    }}>
                        {user?.photoURL ? (
                            <Image 
                                source={{ uri: user.photoURL }} 
                                style={{ width: 80, height: 80, borderRadius: 40 }}
                            />
                        ) : (
                            <Text style={{ 
                                fontSize: responsiveFontSize(24), 
                                color: colors.appTextColor6,
                                fontWeight: 'bold'
                            }}>
                                {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                            </Text>
                        )}
                    </View>
                    
                    <Text isTinyTitle alignTextCenter style={{ 
                        fontSize: responsiveFontSize(20), 
                        color: colors.appTextColor1,
                        marginBottom: 5
                    }}>
                        {user?.displayName || 'User'}
                    </Text>
                    
                    <Text isRegular alignTextCenter style={{ 
                        fontSize: responsiveFontSize(14), 
                        color: colors.appTextColor4
                    }}>
                        {user?.email}
                    </Text>
                </Wrapper>

                <Spacer height={responsiveHeight(4)} />

                {/* Logout Button */}
                <Buttons.Colored 
                    text={loading ? "Logging out..." : "Logout"} 
                    onPress={handleLogout}
                    disabled={loading}
                    buttonColor={colors.appColor3}
                    tintColor={colors.appTextColor6}
                />

                <Spacer isBasic />
            </Wrapper>
        </Wrapper>
    );
}

