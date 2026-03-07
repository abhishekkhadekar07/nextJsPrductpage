pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    ansiColor('xterm')
  }

  environment {
    CI = 'true'
    NODE_ENV = 'test'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm ci'
          } else {
            bat 'npm ci'
          }
        }
      }
    }

    stage('Lint') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm run lint'
          } else {
            bat 'npm run lint'
          }
        }
      }
    }

    stage('Vitest') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm run test:run'
          } else {
            bat 'npm run test:run'
          }
        }
      }
    }

    stage('Jest Check') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm run test:jest'
          } else {
            bat 'npm run test:jest'
          }
        }
      }
    }

    stage('Build') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm run build'
          } else {
            bat 'npm run build'
          }
        }
      }
    }
  }

  post {
    always {
      echo 'Pipeline finished.'
    }
    success {
      echo 'All checks passed.'
    }
    failure {
      echo 'Pipeline failed.'
    }
  }
}
