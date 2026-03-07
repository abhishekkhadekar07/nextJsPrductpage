pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    CI = 'true'
    NODE_ENV = 'test'
    DOCKER_IMAGE_REPO = 'your-dockerhub-username/productpage'
    DOCKER_CREDENTIALS_ID = 'dockerhub-creds'
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

    stage('Docker Build') {
      when {
        branch 'master'
      }
      steps {
        script {
          def imageTag = env.BUILD_NUMBER
          if (isUnix()) {
            sh "docker build -t ${env.DOCKER_IMAGE_REPO}:${imageTag} -t ${env.DOCKER_IMAGE_REPO}:latest ."
          } else {
            bat "docker build -t ${env.DOCKER_IMAGE_REPO}:${imageTag} -t ${env.DOCKER_IMAGE_REPO}:latest ."
          }
        }
      }
    }

    stage('Docker Push') {
      when {
        branch 'master'
      }
      steps {
        script {
          def imageTag = env.BUILD_NUMBER
          withCredentials([
            usernamePassword(
              credentialsId: env.DOCKER_CREDENTIALS_ID,
              usernameVariable: 'DOCKERHUB_USERNAME',
              passwordVariable: 'DOCKERHUB_TOKEN'
            )
          ]) {
            if (isUnix()) {
              sh '''
                echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
              '''
              sh "docker push ${env.DOCKER_IMAGE_REPO}:${imageTag}"
              sh "docker push ${env.DOCKER_IMAGE_REPO}:latest"
              sh 'docker logout'
            } else {
              bat '''
                @echo off
                echo %DOCKERHUB_TOKEN% | docker login -u %DOCKERHUB_USERNAME% --password-stdin
              '''
              bat "docker push ${env.DOCKER_IMAGE_REPO}:${imageTag}"
              bat "docker push ${env.DOCKER_IMAGE_REPO}:latest"
              bat 'docker logout'
            }
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
