import {defineStore} from "pinia";
const baseUrl = `${import.meta.env.VITE_BASE_API_URL}`;
import { ElNotification } from 'element-plus'
import type { Task } from '../../interfaces'
import axios from "axios";

export const useTaskStore = defineStore({
    id: 'task',
    state:() =>({
        loading: false,
        taskList: [] as Task[],
        
        taskForm: { } as Task,
        saveTaskBtn: false,
        formDrawer: false,
        selectedTaskId: null as number | null,
    }),
    actions: {
        async getListing () {
            this.loading = true;
                axios.get(`${baseUrl}/tasks`)
                .then((response: any)=>{
                    this.taskList = response.data?.data
                })
                .catch((error: any)=>{
                    console.log(error);
                    ElNotification({
                        title: 'Error',
                        message: "Something went wrong, please try again later",
                        type: 'error',
                      })
                }).finally(()=>{
                this.loading = false;
            })
        },
        
        async getTask() {
            try {
                const response = await axios.get(`${baseUrl}/tasks/${this.selectedTaskId}`);
                this.taskForm = response.data?.data;
            } catch (error) {
                ElNotification({
                    title: 'Error',
                    message: 'Failed to get task, please try again later',
                    type: 'error',
                });
            }
        },
        async createTask() {
            const data = {
                ...this.taskForm
            }
            this.saveTaskBtn = true;
            try {
                const response = await axios.post(`${baseUrl}/tasks`, data);

                ElNotification({
                    title: 'Success',
                    message: response?.data.message,
                    type: 'success',
                  })

                await this.getListing();
                this.formDrawer = false;
            } catch (error: any) {
                ElNotification({
                    title: 'Error',
                    message: error,
                    type: 'error',
                  })
            } finally {
                this.saveTaskBtn = false;
            }
        },
        async updateTask() {
            const data = {
                ...this.taskForm
            }
            this.saveTaskBtn = true;
            try {
               const response = await axios.put(`${baseUrl}/tasks/${this.selectedTaskId}`, data);
               ElNotification({
                title: 'Success',
                message: response?.data.message,
                type: 'success',
              })
                await this.getListing();
                this.formDrawer = false;
            } catch (error: any) {
                ElNotification({
                    title: 'Error',
                    message: error,
                    type: 'error',
                  })
            } finally {
                this.saveTaskBtn = false;
            }
        },

        async deleteTask(id: number) {
            try {
                const response = await axios.delete(`${baseUrl}/tasks/${id}`);
                ElNotification({
                    title: 'Success',
                    message: response?.data.message,
                    type: 'success',
                  })
                await this.getListing();
            } catch (error: any) {
                ElNotification({
                    title: 'Error',
                    message: error,
                    type: 'error',
                  })
            }
        }
    }
})