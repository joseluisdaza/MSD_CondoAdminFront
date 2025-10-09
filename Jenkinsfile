// Jenkinsfile
pipeline {
  agent any
  stages {
    stage('Descargar Codigo') {
      steps {
        git 'https://github.com/joseluisdaza/MSD_CondoAdminFront.git'
      }
    }
    stage('Instalar dependencias') {
      steps {
        sh 'npm install'
      }
    }
    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
  }
}