pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo 'Checking out the code...'
                    checkout scmGit(
                        branches: [[name: 'v4.11.x']],
                        userRemoteConfigs: [[
                            credentialsId: 'githubcredaccess',
                            url: 'ssh://github.com/DonLofto/testdeploy.git'
                        ]]
                    )
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    echo 'Building the application...'
                    sh 'cd testdeploy'
                    sh 'cd Docker'
                    sh 'cd prod'
                    sh 'docker-compose up --build' 
                }
            }
        }
    }
}