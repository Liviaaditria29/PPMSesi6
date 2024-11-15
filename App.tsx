import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Button,
  FlatList,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import axios from 'axios';

const API_URL = 'https://www.themealdb.com/api/json/v1/1';

const App = () => {
  const [meals, setMeals] = useState<any[]>([]);
  const [mealName, setMealName] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editMeal, setEditMeal] = useState<any | null>(null);

  const fetchMeals = async () => {
    try {
      const response = await axios.get(`${API_URL}/search.php?s=`);
      setMeals(response.data.meals);
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleAddMeal = async () => {
    if (!mealName.trim()) return;
    const newMeal = {
      strMeal: mealName,
      strMealThumb: 'https://www.themealdb.com/images/media/meals/1.png',
      idMeal: Math.random().toString(),
    };
    setMeals(prevMeals => [...prevMeals, newMeal]);
    setMealName('');
  };

  const handleEditMeal = (meal: any) => {
    setIsEditing(true);
    setEditMeal(meal);
    setMealName(meal.strMeal);
  };

  const handleUpdateMeal = () => {
    if (!mealName.trim()) return;
    const updatedMeals = meals.map(meal =>
      meal === editMeal ? {...meal, strMeal: mealName} : meal,
    );
    setMeals(updatedMeals);
    setMealName('');
    setIsEditing(false);
    setEditMeal(null);
  };

  const handleDeleteMeal = (mealId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this meal?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const updatedMeals = meals.filter(meal => meal.idMeal !== mealId);
            setMeals(updatedMeals);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={{padding: 20}}>
      <View>
        <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 20}}>
          {isEditing ? 'Edit Meal' : 'Add Meal'}
        </Text>

        <TextInput
          style={{borderWidth: 1, padding: 10, marginBottom: 20}}
          placeholder="Enter meal name"
          value={mealName}
          onChangeText={setMealName}
        />
        <Button
          title={isEditing ? 'Update Meal' : 'Add Meal'}
          onPress={isEditing ? handleUpdateMeal : handleAddMeal}
        />
      </View>

      <FlatList
        data={meals}
        renderItem={({item}) => (
          <View style={{marginBottom: 20}}>
            <Text>{item.strMeal}</Text>
            <Image
              source={{uri: item.strMealThumb}}
              style={{width: 100, height: 100}}
            />
            <Button title="Edit" onPress={() => handleEditMeal(item)} />
            <Button
              title="Delete"
              onPress={() => handleDeleteMeal(item.idMeal)}
            />
          </View>
        )}
        keyExtractor={item => item.idMeal.toString()}
      />
    </SafeAreaView>
  );
};

export default App;
