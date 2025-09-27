import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { appImages, colors, responsiveFontSize, responsiveWidth, routes, tabs, useReduxStore } from "../../services";
import { Images, Wrapper } from "../../components";
import { Icon } from "@rneui/base";
import * as App from '../../screens/app'
const BottomTabStack = createBottomTabNavigator();

export default function BottomTabNavigation() {
    const tabIconSize = responsiveFontSize(25)




    const TabIcon = ({ color, iconName, iconType, size, focused, image }) => {
        return (
            <Wrapper alignItemsCenter style={{ flex: 1, borderTopWidth: 3.5, borderTopColor: !focused ? colors.appColor1 : colors.appBgColor1, width: responsiveWidth(15), justifyContent: 'center', marginTop: 0 }}>
                {
                    !image ?
                        <Icon name={iconName} type={iconType} size={tabIconSize} color={color} focused={focused} />
                        :
                        <Images.Round source={{ uri: image }} size={tabIconSize} style={{ opacity: focused ? 1 : 0.5 }} />
                }
            </Wrapper>
        )
    }
    return (
        <>
            <BottomTabStack.Navigator
                screenOptions={{
                    headerShown: false,
                    ...tabs.tabBarOptions,
                }}
            >
                <BottomTabStack.Screen
                    name={routes.home}
                    component={App.Home}
                    options={() => ({
                        tabBarLabel: "Home",
                        tabBarIcon: ({ color, size, focused }) => {
                            return <TabIcon iconName='home' iconType='feather' size={tabIconSize} color={color} focused={focused} />
                        },
                    })}
                />
                <BottomTabStack.Screen
                    name={routes.qaida}
                    component={App.Qaida}
                    options={() => ({
                        tabBarLabel: "Qaida",
                        tabBarIcon: ({ color, size, focused }) => {
                            return <TabIcon iconName='book-open' iconType='feather' size={tabIconSize} color={color} focused={focused} />
                        },
                    })}
                />
                <BottomTabStack.Screen
                    name={routes.quran}
                    component={App.Quran}
                    options={() => ({
                        tabBarLabel: "Quran",
                        tabBarIcon: ({ color, size, focused }) => {
                            return <TabIcon iconName='book' iconType='feather' size={tabIconSize} color={color} focused={focused} />
                        },
                    })}
                />
                <BottomTabStack.Screen
                    name={routes.progress}
                    component={App.Progress}
                    options={() => ({
                        tabBarLabel: "Progress",
                        tabBarIcon: ({ color, size, focused }) => {
                            return <TabIcon iconName='trending-up' iconType='feather' size={tabIconSize} color={color} focused={focused} />
                        },
                    })}
                />
                <BottomTabStack.Screen
                    name={routes.account}
                    component={App.Account}
                    options={() => ({
                        tabBarLabel: "Account",
                        tabBarIcon: ({ color, size, focused }) => {
                            return <TabIcon iconName='user' iconType='feather' size={tabIconSize} color={color} focused={focused} />
                        },
                    })}
                />


            </BottomTabStack.Navigator>
        </>
    )
}