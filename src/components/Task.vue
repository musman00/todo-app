    <script lang="ts" setup>
    import { onMounted } from 'vue'
    import { useTaskStore } from '../stores/taskStore'
    import { Plus, Edit, Delete } from '@element-plus/icons-vue'
    import CreateTaskForm from './createTaskForm.vue'
    import moment from "moment/moment";
    import { resetForm } from "../utils/helpers/generic";
    import { ElMessageBox, ElMessage } from 'element-plus'

    const taskStore = useTaskStore();

    onMounted(() => {
        taskStore.getListing();
    })


    const createTask = () => {
        taskStore.selectedTaskId = null;
        resetForm(taskStore.taskForm);
        taskStore.taskForm.completed = false;
        taskStore.formDrawer = true;
    }

    const editTask = async (id: number) => {
        taskStore.selectedTaskId = id;
        taskStore.formDrawer = true;
        await taskStore.getTask();
    }

    const deleteTask = async (id: number) => {
        ElMessageBox.confirm(
            'Are you sure you want to delete this task?',
            'Warning',
            {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning',
                center: true,
            }
        ).then(() => {
            taskStore.deleteTask(id);
        }).catch(() => {
            ElMessage({
                type: 'info',
                message: 'Delete canceled',
            })
        })
    }
</script>

    <template>
        <el-card style="min-width: 1200px">
            <template #header>
                <div class="card-header">
                    <span><b>Task List</b></span>
                    <el-button @click="createTask()" style="float: right;" type="success"><el-icon>
                            <Plus />
                        </el-icon> Create Task</el-button>
                </div>
            </template>

            <el-table :data="taskStore.taskList" style="width: 100%">
                <el-table-column fixed type="index" label="#" width="auto" />
                <el-table-column fixed prop="title" label="Title" width="auto" />
                <el-table-column prop="description" label="Description" width="auto" />
                <el-table-column prop="completed" label="Completed" width="auto">
                    <template #default="scope">
                        <el-tag v-if="scope.row.completed" key="completed" type="success" effect="dark">
                            Completed
                        </el-tag>
                        <el-tag v-else key="pending" type="warning" effect="dark">
                            Pending
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="createdAt" label="Created at" width="auto">
                    <template #default="scope">
                        <span style="min-width: 100px;">
                            {{ moment(scope.row.createdAt).format('MM-DD-YYYY hh:mm A') }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column fixed="right" label="Action" min-width="auto">
                    <template #default="scope">
                        <el-button @click="editTask(scope.row?._id)" link type="primary" size="small"><el-icon size="18"
                                color="green">
                                <Edit />
                            </el-icon><span style="color: green;">Edit</span></el-button>
                        <el-button @click="deleteTask(scope.row?._id)" link type="primary" size="small"><el-icon
                                size="18" color="red">
                                <Delete />
                            </el-icon><span style="color: red;">Delete</span></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <CreateTaskForm v-if="taskStore.formDrawer" />
    </template>