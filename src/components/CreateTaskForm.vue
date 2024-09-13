    <script setup>
    import { ref } from "vue";
    import { ElNotification } from 'element-plus'
    import { useTaskStore } from '../stores/taskStore'

    const taskStore = useTaskStore();
    const taskFormRef = ref(null);

    const onSubmit = async () => {
        const formInstance = taskFormRef.value;
        if (!formInstance) return;

        const validationResult = await formInstance.validate?.();

        if (!validationResult) {
            ElNotification({
                title: 'Error',
                message: 'Please check all the required fields.',
                type: 'error',
            })
            return;
        }

        if (taskStore.selectedTaskId) {
            await taskStore.updateTask();
        } else {
            await taskStore.createTask();
        }
    };


</script>

<template>
    <el-drawer v-model="taskStore.formDrawer" :before-close="handleClose" :with-header="false">
        <div class="demo-drawer__content">
        <h4>{{ taskStore.selectedTaskId != null ? 'Edit Task' : 'Create New Task' }}</h4>
        <el-form :model="taskStore.taskForm" ref="taskFormRef">
            <el-form-item :rules="[{ required: true, message: 'Title is required', trigger: 'blur' }]" prop="title">
                <label for="title">Title</label>
                <el-input v-model="taskStore.taskForm.title" required autocomplete="off" />
            </el-form-item>
            <el-form-item :rules="[{ required: true, message: 'Description is required', trigger: 'blur' }]" prop="description">
                <label for="description">Description</label>
                <el-input v-model="taskStore.taskForm.description" :autosize="{ minRows: 4, maxRows: 10 }"
                    type="textarea" placeholder="Please input" />
            </el-form-item>

            <el-form-item>
                <el-switch v-model="taskStore.taskForm.completed" class="mb-2" active-text="Completed"
                    inactive-text="Pending" />
            </el-form-item>
            <div class="demo-drawer__footer">
                <el-button @click="cancelForm">Close</el-button>
                <el-button type="success" :loading="taskStore.saveTaskBtn" @click="onSubmit">
                    {{ taskStore.saveTaskBtn ? 'Saving ...' : 'Save' }}
                </el-button>
            </div>
        </el-form>
    </div>
    </el-drawer>
</template>