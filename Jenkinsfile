// Jenkinsfile
pipeline {
    agent any

      options {
        // Timeout after 10 minutes
        timeout(time: 10, unit: 'MINUTES')
        // Disable concurrent builds
        disableConcurrentBuilds()
        // Adding color to console output
        ansiColor('xterm')
    }

    environment {
        SOLUTION_DIR = 'CondoFE'
        OUTPUT_DIR = "\\\\localhost\\Cursos\\Maestria Fullstack\\Builds\\CondoFrontEnd\\${BUILD_NUMBER}\\"
    }

    triggers {
        // Polls for changes every 5 minutes (for demonstration; use webhooks for real PR detection)
        pollSCM('H/5 * * * *')
    }

  stages {
    // stage('Descargar Codigo') {
    //   steps {
    //     git 'https://github.com/joseluisdaza/MSD_CondoAdminFront.git'
    //   }
    // }
    stage('Instalar dependencias') {
      steps {
        dir("${env.SOLUTION_DIR}") {
          script {
            bat 'npm install'
          }
        }
      }
    }
    stage('Build') {
      steps {
        dir("${env.SOLUTION_DIR}") {
          script {
            bat 'npm run build'
          }
        }
      }
    }
    stage('Test') {
      steps {
        dir("${env.SOLUTION_DIR}") {
          script {
            bat 'npm test'
          }
        }
      }
    }
  }
}