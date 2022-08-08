const maxVSpan = 5;
const maxHSpan = 5;
const animCycleDuration = 120;

const vertices = [];

function handleOrientation(xRatio, yRatio, camera, startCameraAlpha, startCameraBeta) {
    const cameraMaxDelta = 0.5;

    camera.alpha = startCameraAlpha + xRatio * cameraMaxDelta;
    camera.beta = startCameraBeta + yRatio * cameraMaxDelta;
}

function createScene(engine, canvas) {
    const scene = new BABYLON.Scene(engine);

    scene.clearColor = new BABYLON.Color3(27 / 255, 152 / 255, 224 / 255);

    // BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "box.babylon");

    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
    camera.inputs.remove(camera.inputs.attached.mousewheel);
    // camera.inputs.remove(camera.inputs.attached.mouse);
    camera.attachControl(canvas, true);
    const startCameraAlpha = camera.alpha;
    const startCameraBeta = camera.beta;

    canvas.addEventListener("mousemove", (e) => {
        let xRatio = e.x / canvas.clientWidth - 0.5;
        let yRatio = e.y / canvas.clientHeight - 0.5;
        handleOrientation(xRatio, yRatio, camera, startCameraAlpha, startCameraBeta);
    });

    // window.addEventListener("deviceorientation", (e) => {
    //     console.log(e);
    //     handleOrientation(e.alpha, e.beta, camera, startCameraAlpha, startCameraBeta)
    // } , true);

    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", function (event) {
            console.log(event);
        })
    }

    const vertices = [
        "/assets/images/logos/jira.png",
        "/assets/images/logos/babylonjs.png",
        "/assets/images/logos/blender.png",
        "/assets/images/logos/html5.png",
        "/assets/images/logos/css3.png",
        "/assets/images/logos/js.png",
        "/assets/images/logos/typescript.png",
        "/assets/images/logos/unity.png",
        "/assets/images/logos/vuejs.png",
    ]

    setupVertices(scene, vertices, camera);

    // register meshes update callbacks
    scene.registerBeforeRender(() => {
        scene.transformNodes.forEach(m => {
            if (m.update) {
                m.update();
            }
        });
    });

    return scene;
};

function init3D() {
    const canvas = document.getElementById("banner3DCanvas"); // Get the canvas element
    const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
    // Add your code here matching the playground format

    const scene = createScene(engine, canvas); //Call the createScene function

    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () {
        scene.render();
    });

    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
        engine.resize();
    });

    // scene.debugLayer.show({ embedMode: true });

}

function setupVertices(scene, verticesTextures, camera) {

    verticesTextures.forEach((vertexTexture, index) => {
        let x = Math.random() * maxHSpan * 2 - maxHSpan;
        let y = Math.random() * maxHSpan * 2 - maxHSpan;
        let z = Math.random() * maxVSpan * 2 - maxVSpan;

        // const vertex = BABYLON.MeshBuilder.CreateSphere("sphere", {}, scene);
        const planeSize = 1;
        const options = {
            width: planeSize,
            height: planeSize,
        }
        const vertex = BABYLON.MeshBuilder.CreatePlane("plane", options, scene);

        // Material
        var mat = new BABYLON.StandardMaterial(`vertex-mat-${index}`, scene);
        mat.diffuseTexture = new BABYLON.Texture(vertexTexture, scene);
        mat.diffuseTexture.hasAlpha = true;

        mat.emissiveColor = new BABYLON.Color3.White;
        mat.specularColor = new BABYLON.Color3.Black;
        mat.useAlphaFromDiffuseTexture = true;
        vertex.material = mat;

        let pivot = new BABYLON.TransformNode("root");
        vertex.parent = pivot;
        pivot.position = new BABYLON.Vector3(1, 1, 1);
        vertex.position = new BABYLON.Vector3(x, y, z);

        let randomAxis = new BABYLON.Vector3(Math.random(), Math.random(), Math.random());
        const randomSign = Math.round(Math.random()) * 2 - 1;
        // let stepAngle = 0.00;
        let stepAngle = 0.003;

        // V1 circles
        // Draw lines
        //traj
        // const trajectorySize = 2000;
        // const absPos = vertex.getAbsolutePosition().clone();
        // const trajPoints = [];
        // for (let i = 0; i < trajectorySize; i++) {
        //     trajPoints.push(absPos)
        // }

        // vertex.trajOptions = {
        //     points: trajPoints,
        //     updatable: true
        // }
        // vertex.trajectory = BABYLON.Mesh.CreateLines(`trajectory-${index}`, vertex.trajOptions.points, scene, true);
        // vertex.trajectory.color = BABYLON.Color3.White();
        // vertex.trajectory.color = new BABYLON.Color4(1, 1, 1, 0.1);

        pivot.update = () => {
            vertex.setParent(null);
            let newRotation = BABYLON.Vector3.RotationFromAxis(
                camera.getDirection(BABYLON.Vector3.Right()),
                camera.getDirection(BABYLON.Vector3.Up()),
                camera.getDirection(BABYLON.Vector3.Forward())
            )
            vertex.rotation = newRotation
            vertex.setParent(pivot);
            pivot.rotate(randomAxis, stepAngle * randomSign, BABYLON.Space.WORLD);
            vertex.computeWorldMatrix();
            const vertexAbsolutePos = vertex.getAbsolutePosition();

        // V1 circles
        //     // Updating trajectory line
        //     if (!vertexAbsolutePos.equals(vertex.trajOptions.points[vertex.trajOptions.points.length - 1])) {
        //         vertex.trajOptions.points.push(vertexAbsolutePos.clone());
        //         if (vertex.trajOptions.points.length > trajectorySize) {
        //             vertex.trajOptions.points.shift();
        //         }
        //     }

        //     // vertex.trajectory.points = vertex.trajectoryPoints; 
        //     vertex.trajOptions.instance = vertex.trajectory;
        //     vertex.trajectory = BABYLON.Mesh.CreateLines(`trajectory-${index}`, vertex.trajOptions.points, scene, true, vertex.trajectory);
        }

        vertices.push(vertex);
    });

    // Draw links

    // links
    vertices.forEach(
        (startVertex, startIndex) => {
            startVertex.links = [];
            vertices.forEach(
                (endVertex, endIndex) => {
                    if (endVertex != startVertex) {
                        const linkPoints = [];
                        linkPoints.push(startVertex.getAbsolutePosition())
                        linkPoints.push(endVertex.getAbsolutePosition())
                        const linkOptions ={
                            points: linkPoints,
                            updatable: true
                        }
                        const newLink = BABYLON.Mesh.CreateLines(`link-${startIndex}-${endIndex}`, linkOptions.points, scene, true);
                        newLink.color = new BABYLON.Color3.White();
                        newLink.alpha = 0.1;
                        startVertex.links.push({link : newLink, linkOptions: linkOptions});
                    }
                })
        }
    );
    vertices.forEach(
        (startVertex, startIndex) => {
            startVertex.registerBeforeRender(
                () => {
                    startVertex.links.forEach(
                        (linkInfo, linkIndex) => {
                            const name = `link-${startIndex}-${linkIndex}`;
                            startVertex.links[linkIndex].link = BABYLON.Mesh.CreateLines(name,
                                startVertex.links[linkIndex].linkOptions.points,
                                scene,
                                true,
                                linkInfo.link)
                        }
                    )
                }
            )
        })

}
