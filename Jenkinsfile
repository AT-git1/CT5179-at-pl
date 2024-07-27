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
                    sh 'cd testdeploy'
                    sh 'cd Docker'
                    sh 'cd prod'
                    sh 'docker-compose up --build'
                }
            }
        }
    }
}