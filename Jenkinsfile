pipeline {
    agent any

    environment {
        WORKSPACE_DIR = "build_workspace_${env.BUILD_ID}"
        DOCKER_IMAGE_TAG = "latest"
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Prepare Workspace') {
            steps {
                sh 'mkdir -p ${WORKSPACE_DIR}'
            }
        }

        stage('Checkout') {
            steps {
                sh 'git clone http://github.com/DonLofto/testdeploy.git ${WORKSPACE_DIR}'
            }
        }

        stage('List Directory Contents') {
            steps {
                dir("${WORKSPACE_DIR}") {
                    sh 'ls -R'  // List all files and directories recursively
                }
            }
        }

        stage('Run docker compose') {
            steps {
                dir("${WORKSPACE_DIR}/Docker/prod") {
                    script {
                        // Debugging: Print the current working directory
                        sh 'pwd'
                        // Debugging: List the contents of the current directory
                        sh 'ls -l'
                        // Check if docker-compose.yml exists
                        if (fileExists('docker-compose.yml')) {
                            try {
                                sh 'docker-compose down -v --remove-orphans'
                                sh 'docker-compose up --build'
                            } catch (Exception e) {
                                // Handle the error and notify the user
                                currentBuild.result = 'FAILURE'
                                error "Docker commands failed: ${e.message}"
                            }
                        } else {
                            error 'docker-compose.yml not found. Aborting.'
                        }
                    }
                }
            }
        }
    }
}
