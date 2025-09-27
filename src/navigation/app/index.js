import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes, headers } from '../../services';
import * as App from '../../screens/app';
import BottomTab from './bottomTab'
const AppStack = createNativeStackNavigator();

const AppNavigation = () => {
    return (
        <AppStack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={routes.home}
        >
             <AppStack.Screen name={routes.bottomTab} component={BottomTab} /> 
            <AppStack.Screen name={routes.qaidaLesson} component={App.QaidaLesson} />
            <AppStack.Screen name={routes.quranSurah} component={App.QuranSurah} />
            <AppStack.Screen name={routes.quranAyah} component={App.QuranAyah} />
            <AppStack.Screen name={routes.settings} component={App.Settings} />
            <AppStack.Screen name={routes.subscription} component={App.Subscription} />
            <AppStack.Screen name={routes.pronunciationTest} component={App.PronunciationTest} />
            <AppStack.Screen name={routes.pronunciationDemo} component={App.PronunciationDemo} />

        </AppStack.Navigator>
    )
}

export default AppNavigation