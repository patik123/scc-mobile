<template>
  <div>
    <v-app>
      <offlineAlter v-if="$nuxt.isOffline"></offlineAlter>
      <errorRequestAlter v-if="request_error"></errorRequestAlter>
      <v-sheet class="no-radius" height="100%" width="100%">
        <v-app-bar>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

          <v-toolbar-title>Šolski center Celje</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn href="/Navodila.pdf" icon target="_blank" class="d-none d-sm-flex"><v-icon>help_outline</v-icon></v-btn>
          <v-btn icon @click="darkMode()">
            <v-icon>{{ dark_light_icon }}</v-icon></v-btn
          >
          <v-btn icon @click="login()"><v-icon>login</v-icon></v-btn>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" absolute temporary>
          <v-list>
            <v-list-item link>
              <v-list-item-content>
                <v-list-item-title class="text-h6"> {{ user_data.first_name + ' ' + user_data.last_name }} </v-list-item-title>
                <v-list-item-subtitle>{{ user_class }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>
          <MenuLinks :school-website="school_website()" :school="school" />
        </v-navigation-drawer>

        <v-main>
          <v-container fluid>
            <div>
              <v-btn :color="getSchoolColor()" class="mb-3" @click="new_task_dialog = true"><v-icon>add</v-icon><span class="d-none d-sm-flex">Novo opravilo</span></v-btn>
            </div>

            <v-card>
              <div v-if="tasks.length === 0">
                <v-list two-line>
                  <v-list-item>
                    <v-list-item-content>
                      <div class="text-center">
                        <v-list-item-title class="text-wrap">Izgleda, da nimate nobenih opravil</v-list-item-title>
                        <img src="~/static/tasks.svg" alt="Slika koledarja " class="widget-img mt-2" />
                      </div>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>

              <div v-for="task in tasks" :key="task.id" :data-id="task.id" @click="showTask" @contextmenu="markAsDoneTaskDclClick">
                <v-list-item two-line>
                  <v-list-item-content :class="{ 'task-done': task.status === 'completed' }">
                    <v-list-item-title>{{ task.title }}</v-list-item-title>
                    <v-list-item-subtitle v-if="task.dueDateTime" :class="{ 'task-overdue': $moment().isAfter($moment(task.dueDateTime.dateTime)) }">{{
                      $moment(task.dueDateTime.dateTime).utcOffset('+0200').format('DD. MM. YYYY')
                    }}</v-list-item-subtitle>
                    <v-divider></v-divider>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </v-card>
          </v-container>
        </v-main>

        <!-- New task dialog -->
        <v-dialog v-model="new_task_dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
          <v-card>
            <v-toolbar :color="getSchoolColor()">
              <v-btn icon @click="closeNewTaskDialog">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Novo opravilo</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn text :disabled="!new_task_form.valid" @click="createNewTask()"> <v-icon>save</v-icon> </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-card-text class="mt-3">
              <v-form v-model="new_task_form.valid">
                <v-text-field v-model="new_task_form.task_name" :rules="[() => !!new_task_form.task_name || 'To polje je zahtevano']" label="Naziv opravila" outlined :color="getSchoolColor()" :background-color="getSchoolColor()"></v-text-field>
                <v-row>
                  <v-col>
                    <v-menu ref="new_taks_remainder_date_menu" :close-on-content-click="false" transition="scale-transition" left offset-y min-width="auto">
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="new_task_form.due_date"
                          append-icon="clear"
                          :color="getSchoolColor()"
                          :background-color="getSchoolColor()"
                          label="Opraviti do"
                          readonly
                          outlined
                          v-bind="attrs"
                          v-on="on"
                          @click:append="new_task_form.due_date = ''"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="new_task_form.due_date" no-title color="#002f5f" background-color="#002f5f" first-day-of-week="1"></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="new_task_form.importance"
                      :items="[
                        { text: 'Nizka', value: 'low' },
                        { text: 'Normalna', value: 'normal' },
                        { text: 'Visoka', value: 'high' },
                      ]"
                      label="Pomembnost"
                      :color="getSchoolColor()"
                      :item-color="schoolBGColor()"
                      outlined
                    >
                    </v-select>
                  </v-col>
                </v-row>
                <div>
                  <v-textarea v-model="new_task_form.task_description" label="Opis opravila" outlined :color="getSchoolColor()" :background-color="getSchoolColor()"></v-textarea>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>

        <!-- EDIT TASK DIALOG -->
        <v-dialog v-model="edit_task_dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
          <v-card>
            <v-toolbar :color="getSchoolColor()">
              <v-btn icon @click="closeEditTaskDialog()">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Uredi opravilo</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn text :disabled="!new_task_form.valid" @click="updateTask()"> <v-icon>save</v-icon> </v-btn>
                <v-btn text @click="deleteTask()"> <v-icon>delete</v-icon> </v-btn>
                <v-btn v-if="edit_task_form.status !== 'completed'" text @click="markAsDoneTask()"> <v-icon>done</v-icon> </v-btn>
                <v-btn v-if="edit_task_form.status === 'completed'" text @click="markAsNotDoneTask()"> <v-icon>clear</v-icon> </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-card-text class="mt-3">
              <v-form v-model="new_task_form.valid">
                <v-text-field v-model="edit_task_form.task_name" :rules="[() => !!edit_task_form.task_name || 'To polje je zahtevano']" label="Naziv opravila" outlined :color="getSchoolColor()" :background-color="getSchoolColor()"></v-text-field>
                <v-row>
                  <v-col>
                    <v-menu ref="edit_taks_remainder_date_menu" :close-on-content-click="false" transition="scale-transition" left offset-y min-width="auto">
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="edit_task_form.due_date"
                          :color="getSchoolColor()"
                          :background-color="getSchoolColor()"
                          append-icon="clear"
                          label="Opraviti do"
                          readonly
                          outlined
                          v-bind="attrs"
                          v-on="on"
                          @click:append="edit_task_form.due_date = ''"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="edit_task_form.due_date" no-title color="#002f5f" background-color="#002f5f" first-day-of-week="1"></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="edit_task_form.importance"
                      :items="[
                        { text: 'Nizka', value: 'low' },
                        { text: 'Normalna', value: 'normal' },
                        { text: 'Visoka', value: 'high' },
                      ]"
                      label="Pomembnost"
                      :color="getSchoolColor()"
                      :item-color="schoolBGColor()"
                      outlined
                    >
                    </v-select>
                  </v-col>
                </v-row>
                <div>
                  <v-textarea v-model="edit_task_form.task_description" label="Opis opravila" outlined :color="getSchoolColor()" :background-color="getSchoolColor()"></v-textarea>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-sheet>
    </v-app>
  </div>
</template>

<script>
import basicFunctions from '~/assets/js/basic_functions.js'
import authMiddleware from '~/assets/js/auth_middleware.js'

export default {
  name: 'Opravila',
  mixins: [basicFunctions, authMiddleware],
  data() {
    return {
      task_list_id: '',
      tasks: [],
      new_task_dialog: false,
      edit_task_dialog: false,

      // NEW TASK FORM
      new_task_form: {
        valid: false,
        task_name: '',
        task_description: '',
        isReminderOn: '',
        status: '',
        importance: 'normal',
        due_date: '',
      },

      // EDIT TASK FORM
      edit_task_form: {
        valid: false,
        id: '',
        task_name: '',
        task_description: '',
        isReminderOn: '',
        status: '',
        importance: '',
        due_date: '',
      },
    }
  },
  created() {
    this.getTaskList()
    this.$vuetify.lang.current = 'sl'
    if (this.$router.currentRoute.query.action === 'new-task') {
      this.new_task_dialog = true
    }
  },
  methods: {
    getTaskList() {
      this.$axios.get('https://graph.microsoft.com/v1.0/me/todo/lists').then((response) => {
        this.task_list_id = response.data.value[0].id
        this.getTasks()
      })
    },

    getTasks() {
      this.$axios.get('https://graph.microsoft.com/v1.0/me/todo/lists/' + this.task_list_id + '/tasks').then((response) => {
        this.tasks = response.data.value
      })
    },

    createNewTask() {
      let dueDateTime
      console.log(this.new_task_form.due_date)
      if (this.new_task_form.due_date === '') {
        this.new_task_form.isReminderOn = false
        dueDateTime = null
      } else {
        this.new_task_form.isReminderOn = true
        dueDateTime = { dateTime: this.$moment(this.new_task_form.due_date).format('YYYY-MM-DDTHH:mm:ss'), timeZone: 'UTC' }
      }
      this.$axios
        .post('https://graph.microsoft.com/v1.0/me/todo/lists/' + this.task_list_id + '/tasks', {
          title: this.new_task_form.task_name,
          body: {
            contentType: 'text',
            content: this.new_task_form.task_description,
          },
          isReminderOn: this.new_task_form.isReminderOn,
          importance: this.new_task_form.importance,
          dueDateTime,
        })
        .then((response) => {
          this.getTasks()
          this.closeNewTaskDialog()
        })
    },

    showTask(e) {
      const taskId = e.currentTarget.dataset.id
      this.$axios.get('https://graph.microsoft.com/v1.0/me/todo/lists/' + this.task_list_id + '/tasks/' + taskId).then((response) => {
        this.edit_task_form.id = response.data.id
        this.edit_task_form.task_name = response.data.title
        this.edit_task_form.task_description = response.data.body.content
        this.edit_task_form.isReminderOn = response.data.isReminderOn
        this.edit_task_form.status = response.data.status
        this.edit_task_form.importance = response.data.importance
        this.edit_task_form.due_date = response.data.dueDateTime ? this.$moment(response.data.dueDateTime.dateTime).format('YYYY-MM-DD') : ''
      })
      this.edit_task_dialog = true
    },

    updateTask() {
      let dueDate
      if (this.edit_task_form.due_date === '') {
        this.edit_task_form.isReminderOn = false
        dueDate = null
      } else {
        this.edit_task_form.isReminderOn = true
        dueDate = { dateTime: this.$moment(this.edit_task_form.due_date).format('YYYY-MM-DDTHH:mm:ss'), timeZone: 'UTC' }
      }
      this.$axios
        .patch('https://graph.microsoft.com/v1.0/me/todo/lists/' + this.task_list_id + '/tasks/' + this.edit_task_form.id, {
          title: this.edit_task_form.task_name,
          body: {
            contentType: 'text',
            content: this.edit_task_form.task_description,
          },
          isReminderOn: this.edit_task_form.isReminderOn,
          importance: this.edit_task_form.importance,
          dueDateTime: dueDate,
        })
        .then((response) => {
          this.getTasks()
          this.closeEditTaskDialog()
        })
    },

    closeEditTaskDialog() {
      this.edit_task_dialog = false
      this.edit_task_form = {
        id: '',
        task_name: '',
        task_description: '',
        isReminderOn: '',
        status: '',
        importance: '',
        due_date: '',
      }
    },

    closeNewTaskDialog() {
      this.new_task_dialog = false
      this.new_task_form = {
        task_name: '',
        task_description: '',
        isReminderOn: '',
        status: '',
        importance: 'normal',
        due_date: '',
      }
    },

    deleteTask() {
      this.$axios.delete('https://graph.microsoft.com/v1.0/me/todo/lists/' + this.task_list_id + '/tasks/' + this.edit_task_form.id).then((response) => {
        if (response.status === 204) {
          this.edit_task_dialog = false
          this.getTasks()
        } else {
          this.setRequestError()
        }
      })
    },

    markAsDoneTask() {
      this.$axios
        .patch('https://graph.microsoft.com/v1.0/me/todo/lists/' + this.task_list_id + '/tasks/' + this.edit_task_form.id, {
          status: 'completed',
        })
        .then((response) => {
          this.getTasks()
          this.closeEditTaskDialog()
        })
    },
    markAsDoneTaskDclClick(e) {
      const taskId = e.currentTarget.dataset.id
      this.$axios
        .patch('https://graph.microsoft.com/v1.0/me/todo/lists/' + this.task_list_id + '/tasks/' + taskId, {
          status: 'completed',
        })
        .then((response) => {
          this.getTasks()
        })
    },

    markAsNotDoneTask() {
      this.$axios
        .patch('https://graph.microsoft.com/v1.0/me/todo/lists/' + this.task_list_id + '/tasks/' + this.edit_task_form.id, {
          status: 'notStarted',
        })
        .then((response) => {
          this.getTasks()
          this.closeEditTaskDialog()
        })
    },
  },
}
</script>

<style scoped>
.widget-img {
  width: 20%;
  height: 20%;
}

.task-done {
  text-decoration: line-through;
}
.task-overdue {
  color: #ff5252 !important;
}

@media screen and (max-width: 960px) {
  .widget-img {
    width: 40%;
    height: 40%;
  }
}
</style>
