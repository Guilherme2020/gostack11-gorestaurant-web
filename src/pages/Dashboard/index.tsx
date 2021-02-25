import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  async function loadFoods(): Promise<void> {
    // TODO LOAD FOODS
    const response = await api.get('/foods');
    setFoods(response.data);
  }
  useEffect(() => {
    loadFoods();
  }, []);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      const newData = { ...food, available: true };
      const response = await api.post('/foods', newData);
      if (response.data) {
        setModalOpen(false);
        setFoods([...foods, response.data]);
      }
    } catch (err) {
      console.log(err);
      setModalOpen(true);
    }
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      const url = `/foods/${editingFood.id}`;

      const newData = {
        id: editingFood.id,
        available: editingFood.available,
        ...food,
      };
      const response = await api.put(url, newData);
      setFoods(
        foods.map(mappedFood =>
          mappedFood.id === editingFood.id ? { ...response.data } : mappedFood,
        ),
      );
    } catch (e) {
      setEditModalOpen(true);
    }
  }

  async function handleDeleteFood(id: number): Promise<void> {
    // TODO DELETE A FOOD PLATE FROM THE API
    try {
      const url = `/foods/${id}`;
      await api.delete(url);
      setFoods(foods.filter(food => food.id !== id));
    } catch (e) {
      throw new Error('Error ao excluir');
    }
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    // TODO SET THE CURRENT EDITING FOOD ID IN THE STATE
    setEditingFood(food);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
              openModal={toggleEditModal}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
