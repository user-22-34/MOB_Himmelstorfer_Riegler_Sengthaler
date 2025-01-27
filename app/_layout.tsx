import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../colors';
import { Image } from 'react-native';

// Importieren aller Komponenten / App-Bereiche
import SavedScreen from "./saved";
import SearchScreen from "./search";
import IndexScreen from "./index";
import BookDetails from "./bookdetails";
import List from "./list";
import BookPage from './(book)/[id]';

// Navigation anlegen
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Logo für Header / Überschrift einbinden
const InkpathLogo = () => (
    <Image
        source={require('../assets/images/inkpathlogocrop.png')}
        style={{
            width: 45, height: 45,
            marginRight: 10,
            marginTop: 2,
        }}
        resizeMode="contain"
    />
);

// Navigation für Detailansicht Buchsuche -> Buchdetails
function SearchStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
            <Stack.Screen name="BookDetails" component={BookDetails} options={{
                headerTitle: "Details",
                headerStyle: {
                    backgroundColor: colors.lightgreen},
                headerTitleStyle: {
                    fontWeight: "normal",
                },
            }}
            />
        </Stack.Navigator>
    );
}

// Navigation für Detailansicht gescannte Bücherliste -> Buchdetails
function ListStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="List" component={List} options={{ headerShown: false }} />
            <Stack.Screen name="BookPage" component={BookPage} options={{
                headerTitle: "Details",
                headerStyle: {
                    backgroundColor: colors.lightgreen},
                headerTitleStyle: {
                    fontWeight: "normal",
                },
            }}
            />
        </Stack.Navigator>
    );
}

// Tabnavigation / Navigation in Footer
export default function TabsLayout() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    // Wahl der Icons anhand Datei/Routen-Name
                    // (https://icons.expo.fyi/Index - aktuell nur Icons von FontAwesome möglich)
                    if (route.name === 'index') {
                        iconName = 'home';
                    } else if (route.name === 'search') {
                        iconName = 'search';
                    } else if (route.name === 'saved') {
                        iconName = 'bookmark';
                    } else if (route.name === 'list') {
                        iconName = 'barcode';
                    }
                    return <FontAwesome name={iconName} size={size} color={color} />;
                },
                // Farbe und Style festlegen
                tabBarActiveTintColor: colors.darkgreen,
                tabBarInactiveTintColor: colors.offwhite,
                tabBarActiveBackgroundColor: colors.lightgreen,
                tabBarInactiveBackgroundColor: colors.darkgreen,
                headerStyle: {
                    backgroundColor: colors.darkgreen,
                },
                headerTitleStyle: {
                    fontWeight: 'bold',
                    color: colors.offwhite,
                    fontSize: 26,
                },
            })}
        >
            <Tab.Screen
                name="index"
                component={IndexScreen}
                options={{
                    title: 'Home',
                    headerTitle: 'Home',
                    headerRight: () => <InkpathLogo />,
                }}
            />
            <Tab.Screen
                name="search"
                component={SearchStack}
                options={{
                    title: 'Search',
                    headerTitle: 'Book Search',
                    headerRight: () => <InkpathLogo />,
                }}
            />
            <Tab.Screen
                name="saved"
                component={SavedScreen}
                options={{
                    title: 'Saved',
                    headerTitle: 'Saved Books',
                    headerRight: () => <InkpathLogo />,
                }}
            />
            <Tab.Screen
                name="list"
                component={ListStack}
                options={{
                    title: 'BookScan',
                    headerTitle: 'My Scanned Books',
                    headerRight: () => <InkpathLogo />,
                }}
            />
        </Tab.Navigator>
    );
}
