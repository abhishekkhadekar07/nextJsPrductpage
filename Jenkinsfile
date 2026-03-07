pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    CI = 'true'
    NODE_ENV = 'test'
    DOCKER_IMAGE_NAME = 'productpage'
    DOCKER_CREDENTIALS_ID = 'dockerhub-creds'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Debug Env') {
      steps {
        script {
          echo "BRANCH_NAME=${env.BRANCH_NAME}"
          echo "GIT_BRANCH=${env.GIT_BRANCH}"
          echo "GIT_COMMIT=${env.GIT_COMMIT}"
          echo "BUILD_NUMBER=${env.BUILD_NUMBER}"
          echo "JOB_NAME=${env.JOB_NAME}"
        }
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
        expression {
          def branchName = env.BRANCH_NAME ?: env.GIT_BRANCH ?: ''
          return branchName == 'master' ||
                 branchName == 'main' ||
                 branchName.endsWith('/master') ||
                 branchName.endsWith('/main')
        }
      }
      steps {
        script {
          def branchName = env.BRANCH_NAME ?: env.GIT_BRANCH ?: ''
          def imageTag = env.BUILD_NUMBER
          echo "Docker Build branchName=${branchName}"
          echo "Docker Build imageTag=${imageTag}"
          withCredentials([
            usernamePassword(
              credentialsId: env.DOCKER_CREDENTIALS_ID,
              usernameVariable: 'DOCKERHUB_USERNAME',
              passwordVariable: 'DOCKERHUB_TOKEN'
            )
          ]) {
            echo "Docker Build credentialsId=${env.DOCKER_CREDENTIALS_ID}"
            echo "Docker Build DOCKERHUB_USERNAME=${DOCKERHUB_USERNAME}"
            echo "Docker Build DOCKERHUB_TOKEN_SET=${DOCKERHUB_TOKEN ? 'yes' : 'no'}"
            echo "Docker Build DOCKERHUB_TOKEN_LENGTH=${DOCKERHUB_TOKEN?.length() ?: 0}"
            def imageRepo = "${DOCKERHUB_USERNAME}/${env.DOCKER_IMAGE_NAME}"
            if (isUnix()) {
              sh "docker build -t ${imageRepo}:${imageTag} -t ${imageRepo}:latest ."
            } else {
              bat "docker build -t ${imageRepo}:${imageTag} -t ${imageRepo}:latest ."
            }
          }
        }
      }
    }

    stage('Docker Push') {
      when {
        expression {
          def branchName = env.BRANCH_NAME ?: env.GIT_BRANCH ?: ''
          return branchName == 'master' ||
                 branchName == 'main' ||
                 branchName.endsWith('/master') ||
                 branchName.endsWith('/main')
        }
      }
      steps {
        script {
          def branchName = env.BRANCH_NAME ?: env.GIT_BRANCH ?: ''
          def imageTag = env.BUILD_NUMBER
          echo "Docker Push branchName=${branchName}"
          echo "Docker Push imageTag=${imageTag}"
          withCredentials([
            usernamePassword(
              credentialsId: env.DOCKER_CREDENTIALS_ID,
              usernameVariable: 'DOCKERHUB_USERNAME',
              passwordVariable: 'DOCKERHUB_TOKEN'
            )
          ]) {
            echo "Docker Push credentialsId=${env.DOCKER_CREDENTIALS_ID}"
            echo "Docker Push DOCKERHUB_USERNAME=${DOCKERHUB_USERNAME}"
            echo "Docker Push DOCKERHUB_TOKEN_SET=${DOCKERHUB_TOKEN ? 'yes' : 'no'}"
            echo "Docker Push DOCKERHUB_TOKEN_LENGTH=${DOCKERHUB_TOKEN?.length() ?: 0}"
            def imageRepo = "${DOCKERHUB_USERNAME}/${env.DOCKER_IMAGE_NAME}"
            if (isUnix()) {
              sh '''
                echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
              '''
              sh "docker push ${imageRepo}:${imageTag}"
              sh "docker push ${imageRepo}:latest"
              sh 'docker logout'
            } else {
              bat '''
                @echo off
                echo %DOCKERHUB_TOKEN% | docker login -u %DOCKERHUB_USERNAME% --password-stdin
              '''
              bat "docker push ${imageRepo}:${imageTag}"
              bat "docker push ${imageRepo}:latest"
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
