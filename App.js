/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';


const COLORS = {primary: '#1f145c', white: '#fff'};



function App(){
  const [textInput, setTextInput] = useState('');
  const [todos, setTodos] = useState([
    {id: 1, task: 'First todo', completed: true},
    {id: 2, task: 'second todo', completed:false},
  ]);
  useEffect(()=> {
    getTododsFromUserDevice();
  },[]);
  useEffect(()=>{
    saveTodoTouserDevice(todos);
  },[todos]);

  const ListItem = ({todo}) => {
    return (
    <View style={styles.listItem}>
      <View style={{flex: 1}}>
        <Text style={{
          fontWeight: 'bold',
         fontSize: 15,
          color: COLORS.primary,
          textDecorationLine: todo?.completed ? 'line-through' : 'none',
           }}>
             {todo?.task}
          </Text>
      </View>
           {!todo?.completed && (
              <TouchableOpacity style={[styles.actionIcon]} onPress={()=>markTodoComplete(todo?.id)}  >

            <View>
                <AntDesign name="check" size={20} color={COLORS.white} />
                </View>

            </TouchableOpacity>
           )}

      <TouchableOpacity
       style={[styles.actionIcon,
        {backgroundColor: 'red'}]}
         onPress={()=>deleteTodo(todo?.id)}
         >
            <View style={styles.iconContainer2}>
        <AntDesign name="delete" size={20} color={COLORS.white} />
        </View>
      </TouchableOpacity>

    </View>
  );
};


const saveTodoTouserDevice = async todos=> {
  try {
    const stringifyTodos = JSON.stringify(todos);
    await AsyncStorage.setItem('todos',stringifyTodos );
  } catch (e) {
    console.log(e);
  }
};

const getTododsFromUserDevice = async () => {
  try {
    const todos = await AsyncStorage.getItem('todos');
    if (todos != null) {
      setTodos(JSON.parse(todos));
    }
  } catch (error) {

  }
};

const addTodo = () => {
  if (textInput == '') {
    Alert.alert('Error', 'please input todo');
  } else {
    const newTodo = {
      id: Math.random(),
      task: textInput,
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setTextInput('');
  }
};

const markTodoComplete = (todoId) => {
const newTodos = todos.map((item)=> {
  if (item.id == todoId) {
    return {...item, completed: true};
  }
  return item;
});
setTodos(newTodos);
};

const deleteTodo = todoId => {
  const newTodos = todos.filter(item => item.id != todoId);
  setTodos(newTodos);
};

const clearTodos = () => {
  Alert.alert('Confirm','Clear todos?', [
    {
      text: 'Yes',
      onPress: ()=>  setTodos([]),
    },
    {text: 'No'},
  ]);
};





  return (
   <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
    <View style={styles.header}>
      <Text style={{ fontWeight:'bold', fontSize: 20, color: COLORS.primary}}>TODO APP</Text>


      <AntDesign name="delete" size={40} color="red" onPress={clearTodos}/>


    </View>

    <FlatList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{padding: 20, paddingBottom: 100}}
      data={todos}
      renderItem={({item}) => <ListItem todo={item} /> }
       />
    <View style={styles.footer}>
      <View style={styles.inputContainer}>
        <TextInput
        style={{fontSize: 30}}
         placeholder="Add Todo"
         value={textInput}
           onChangeText={text => setTextInput(text)}
          />
      </View>
      <TouchableOpacity onPress={addTodo} >
        <View style={styles.iconContainer}>
        {/* <Text style={{fontSize:40, color:'white'}}>+</Text> */}
        <AntDesign name="plus" size={40} color="white" />
        </View>
    </TouchableOpacity>
    </View>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems:'center',
    marginLeft: 5,
    borderRadius: 3,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    color: COLORS.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
    justifyContent: 'center',

  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,

    shadowColor: '#000',
   shadowOffset: { width: 1, height: 2 },
  shadowOpacity: 0.5,
   shadowRadius: 2,

  },
});

export default App;
