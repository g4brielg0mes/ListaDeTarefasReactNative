import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, TextInput, TouchableOpacity, FlatList, Text } from 'react-native';

export default function App() {
  const [todos, setTodos] = useState(null);
  const [title, setTitle] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [idCounter, setIdCounter] = useState(1); // Contador para gerar IDs únicos

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      const data = await response.json();

      // Filtrar os resultados por um critério, como um campo de usuário
      const userTodos = data.filter(todo => todo.userId === 100);

      setTodos(userTodos);
    } catch (error) {
      console.error(error);
    }
  };

  const addTodo = () => {
    const newTodo = {
      id: idCounter,
      title,
      completed: false,
      userId: 100, // Definir o ID do usuário para o qual as atividades devem ser adicionadas
    };

    setTodos([...todos, newTodo]);
    setTitle('');
    setIdCounter(idCounter + 1); // Incrementar o contador de IDs
  };

  const updateTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: true } : todo
    );
    setTodos(updatedTodos);
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const handleTodoEditStart = (id) => {
    setEditingTodoId(id);
  };

  const handleTodoTitleChange = (id, text) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, title: text } : todo
    );
    setTodos(updatedTodos);
  };

  const handleTodoEditComplete = () => {
    setEditingTodoId(null);
  };

  const renderItem = ({ item }) => {
    const isEditing = editingTodoId === item.id;

    return (
      <View style={styles.item}>
        <View style={styles.textContainer}>
          {isEditing ? (
            <TextInput
              style={[styles.title, styles.editingInput]}
              value={item.title}
              onChangeText={(text) => handleTodoTitleChange(item.id, text)}
              autoFocus
              onSubmitEditing={handleTodoEditComplete}
              blurOnSubmit
            />
          ) : (
            <Text style={styles.title}>{item.title}</Text>
          )}
        </View>

        <View style={styles.buttonGroup}>
          {!item.completed && !isEditing && (
            <TouchableOpacity style={styles.buttonContainer} onPress={() => updateTodo(item.id)}>
              <Text style={styles.buttonText}>Concluir</Text>
            </TouchableOpacity>
          )}

          {!isEditing && (
            <TouchableOpacity style={styles.buttonContainer} onPress={() => handleTodoEditStart(item.id)}>
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
          )}

          {!isEditing && (
            <TouchableOpacity style={styles.buttonContainer} onPress={() => deleteTodo(item.id)}>
              <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Aplicativo de Tarefas</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#FFF" // Definir a cor do placeholder como branco
          placeholder="Digite uma nova tarefa"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
      {todos !== null && todos.length > 0 ? (
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.emptyText}>Nenhuma tarefa encontrada.</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    backgroundColor: '#333',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  formContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
    fontSize: 16,
    color: '#FFF',
  },
  addButton: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#444',
    borderRadius: 4,
  },
  title: {
    flex: 1,
    marginRight: 10,
    fontSize: 16,
    color: '#FFF',
  },
  textContainer: {
    flex: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 8,
  },
  buttonContainer: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center ',
    fontStyle: 'italic',
    color: '#999',
  },
  editingInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    color: '#000',
  },
});
