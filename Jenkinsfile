pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'Docker/prod/docker-compose.yml'
        DOCKERFILE = 'Docker/prod/Dockerfile'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    docker.build('enersave-prod-backend', "-f ${DOCKERFILE} --build-arg SERVICE=start:server .")
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    docker.build('enersave-prod-frontend', "-f ${DOCKERFILE} --build-arg SERVICE=start:client .")
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh "docker-compose -f ${DOCKER_COMPOSE_FILE} up -d"
                }
            }
        }
    }


}