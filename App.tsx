
import { StatusBar } from 'expo-status-bar';
import {Button, FlatList, StyleSheet, Text, View} from 'react-native';
import {useState} from "react";
import Header from "./components/header";
import {colors} from "./colors.js";

export default function App() {

  // TODO: delete vartest & alles zugehörige
  const [vartest, setVartest] = useState('hui');

  const vartestHandler = () => {
    if(vartest === "hui"){
      setVartest("iuh")
    }
    else{
      setVartest("hui");
    }
  }

  const [people,setPeople] = useState([
    { name: 'shaun the sheep', id: '1' },
    { name: 'yoshi', id: '2' },
    { name: 'mario', id: '3' },
    { name: 'luigi', id: '4' },
    { name: 'peach', id: '5' },
    { name: 'toad', id: '6' },
    { name: 'bowser', id: '7' },
    { name: 'test', id: '8' },
  ]);

  console.log(people);


  return (
    <View style={styles.container}>
      <Header/>
      <View style={styles.test}>
        <Text>Hello World</Text>
        <Text>Hello World Hello World Hello World Hello World Hello World Hello World Hello World</Text>
      </View>
      <View style={styles.test}>
        <Text>Ergebnis von vartest: {vartest}</Text>
        <View style={styles.buttonContainer}>
          <Button color={colors.darkgreen} title='update vartest' onPress={vartestHandler}/>
        </View>
      </View>

      <View style={styles.container}>
        <FlatList data={people} renderItem={
          ({item})=>(
              <Text style={styles.item}>{item.name}</Text>
          )
          }/>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}



// Style / Aussehen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offwhite,
    alignItems: 'center',
    justifyContent: 'center',

  },
  buttonContainer:{
    padding: 10,
  },
  item:{
    backgroundColor: colors.lightgreen,
    padding: 10,
    margin: 10,
  },


  test:{
    //
  },

});

