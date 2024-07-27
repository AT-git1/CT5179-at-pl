pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'Docker/prod/docker-compose.yml'
        // Add your Docker registry URL here if you're using one
        // DOCKER_REGISTRY = 'your-registry-url'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Start Docker Containers') {
            steps {
                sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} up --build -d'
            }
        }

        stage('Push Docker Images') {
            steps {
                // Uncomment and modify these lines if you're using a Docker registry
                // sh 'docker login ${DOCKER_REGISTRY} -u $DOCKER_USERNAME -p $DOCKER_PASSWORD'
                // sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} push'
                echo 'Skipping push to registry. Uncomment the lines above if you want to push to a registry.'
            }
        }

        // Additional stages for testing, deployment, etc. can be added here
    }

    post {
        failure {
            sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} down'
        }
    }
}