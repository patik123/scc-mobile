<template>
  <div>
    <v-app>
      <offlineAlter v-if="$nuxt.isOffline"></offlineAlter>
      <errorRequestAlter v-if="request_error"></errorRequestAlter>
      <v-sheet class="no-radius" height="100%" width="100%">
        <v-app-bar color="">
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

          <v-toolbar-title>Šolski center Celje</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon class="mr-2" @click="darkMode()">{{ dark_light_icon }}</v-icon>
          <v-icon @click="$auth.logout('aad')">logout</v-icon>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" absolute temporary>
          <v-list>
            <v-list-item link>
              <v-list-item-content>
                <v-list-item-title class="text-h6"> {{ jwt_decoded.given_name + ' ' + jwt_decoded.family_name }} </v-list-item-title>
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
 <div v-for="task in tasks" :key="task.id" :data-id="task.id" @click="showTask">
<v-list-item two-line>
      <v-list-item-content>
        
        <v-list-item-title>{{task.title}}</v-list-item-title>
        <v-divider></v-divider>
      </v-list-item-content>
    </v-list-item>
 </div>
            </v-card>




          </v-container>
        </v-main>

        <v-dialog v-model="new_task_dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
          <v-card>
            <v-toolbar :color="getSchoolColor()">
              <v-btn icon @click="new_task_dialog = false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Novo opravilo</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn text @click="createNewTask()"> <v-icon>save</v-icon> </v-btn>

              <v-toolbar-items> </v-toolbar-items>
            </v-toolbar>
            <v-card-text class="mt-3">
              <v-text-field label="Naziv opravila" v-model="new_task_form.task_name" outlined :color="getSchoolColor()" :background-color="getSchoolColor()"></v-text-field>
              <v-row>
                <v-col>
                  <v-menu ref="new_taks_remainder_date_menu" :close-on-content-click="false" transition="scale-transition" left offset-y min-width="auto">
                    <template #activator="{ on, attrs }">
                      <v-text-field v-model="new_task_form.due_date" :color="getSchoolColor()" :background-color="getSchoolColor()" label="Opraviti do" readonly outlined v-bind="attrs" v-on="on"></v-text-field>
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
            </v-card-text>
          </v-card>
        </v-dialog>



        <!-- EDIT TASK DIALOG -->
        <v-dialog v-model="edit_task_dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
          <v-card>
            <v-toolbar :color="getSchoolColor()">
              <v-btn icon @click="edit_task_dialog = false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Uredi opravilo</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn text @click="createNewTask()"> <v-icon>save</v-icon> </v-btn>
              <v-btn text @click="deleteTask()"> <v-icon>delete</v-icon> </v-btn>
              <v-btn text @click="markAsDoneTask()"> <v-icon>done</v-icon> </v-btn>

              <v-toolbar-items> </v-toolbar-items>
            </v-toolbar>
            <v-card-text class="mt-3">
              <v-text-field label="Naziv opravila" v-model="edit_task_form.task_name" outlined :color="getSchoolColor()" :background-color="getSchoolColor()"></v-text-field>
              <v-row>
                <v-col>
                  <v-menu ref="edit_taks_remainder_date_menu" :close-on-content-click="false" transition="scale-transition" left offset-y min-width="auto">
                    <template #activator="{ on, attrs }">
                      <v-text-field v-model="edit_task_form.due_date" :color="getSchoolColor()" :background-color="getSchoolColor()" label="Opraviti do" readonly outlined v-bind="attrs" v-on="on"></v-text-field>
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
        task_name: '',
        task_description: '',
        isReminderOn: '',
        status: '',
        importance: 'normal',
        due_date: '',
      },

       // EDIT TASK FORM
      edit_task_form: {
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
      if (this.new_task_form.due_date === '') {
        this.new_task_form.isReminderOn = false
      }
      else {
        this.new_task_form.isReminderOn = true
      }
      this.$axios
        .post('https://graph.microsoft.com/v1.0/me/todo/lists/' + this.task_list_id + '/tasks', 
          {
            title: this.new_task_form.task_name,
            body: {
              contentType: 'text',
              content: this.new_task_form.task_description,
            },
            isReminderOn: this.new_task_form.isReminderOn,
            importance: this.new_task_form.importance,
            dueDateTime: {
              dateTime: this.$moment(this.new_task_form.due_date).format('YYYY-MM-DDTHH:mm:ss'),
              timeZone: 'Europe/Ljubljana',
            },
        })
        .then((response) => {
          console.log(response)
          this.getTasks()
          this.new_task_dialog = false
        })
    },

    showTask(e){
     const task_id = e.currentTarget.dataset.id
      this.$axios.get('https://graph.microsoft.com/v1.0/me/todo/lists/' + this.task_list_id + '/tasks/' + task_id).then((response) => {
        this.edit_task_form.id = response.data.id
        this.edit_task_form.task_name = response.data.title
        this.edit_task_form.task_description = response.data.body.content
        this.edit_task_form.isReminderOn = response.data.isReminderOn
        this.edit_task_form.importance = response.data.importance
        this.edit_task_form.due_date = this.edit_task_form.due_date ? this.$moment(response.data.dueDateTime.dateTime).format('YYYY-MM-DD') : ''
      })
      this.edit_task_dialog = true
    },

    markAsDoneTask(){
      this.$axios.patch('https://graph.microsoft.com/v1.0/me/todo/lists/' + this.task_list_id + '/tasks/' + this.edit_task_form.id, {
        status: 'completed',
        
      }).then((response) => {
        this.getTasks()
        this.edit_task_dialog = false
      })
    }
  },
}
</script>
