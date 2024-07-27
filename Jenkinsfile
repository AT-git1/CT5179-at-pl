pipeline {
    agent any 
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/DonLofto/testdeploy.git', credentialsId: 'githubcredaccess'
            }
        }
        stage('Build') {
            steps {
                script {
                    sh 'docker-compose up --build'
                }
            }
        }
    }
}