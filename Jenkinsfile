pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo 'Checking out the code...'
                    checkout scmGit(
                        branches: [[name: 'main']],
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
                    // Use the dir block to change to the correct directory
                    dir('testdeploy/Docker/prod') {
                        sh 'docker-compose up --build'
                    }
                }
            }
        }
    }
}
