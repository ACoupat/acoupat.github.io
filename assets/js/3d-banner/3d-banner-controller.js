const maxVSpan = 5;
const maxHSpan = 5;
const animCycleDuration = 120;

function createScene(engine, canvas) {
    const scene = new BABYLON.Scene(engine);



    BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "box.babylon");

    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

    const vertices = ["https://i.picsum.photos/id/657/64/64.jpg?hmac=19Zst0_IJk18drk4wnCrVvplNIPWto5xfYsSEOTKmZ0",
        "https://i.picsum.photos/id/657/64/64.jpg?hmac=19Zst0_IJk18drk4wnCrVvplNIPWto5xfYsSEOTKmZ0",
        "https://i.picsum.photos/id/657/64/64.jpg?hmac=19Zst0_IJk18drk4wnCrVvplNIPWto5xfYsSEOTKmZ0",
        "https://i.picsum.photos/id/657/64/64.jpg?hmac=19Zst0_IJk18drk4wnCrVvplNIPWto5xfYsSEOTKmZ0",
        "https://i.picsum.photos/id/657/64/64.jpg?hmac=19Zst0_IJk18drk4wnCrVvplNIPWto5xfYsSEOTKmZ0",
        "https://i.picsum.photos/id/657/64/64.jpg?hmac=19Zst0_IJk18drk4wnCrVvplNIPWto5xfYsSEOTKmZ0",
        "https://i.picsum.photos/id/657/64/64.jpg?hmac=19Zst0_IJk18drk4wnCrVvplNIPWto5xfYsSEOTKmZ0",
        "https://i.picsum.photos/id/657/64/64.jpg?hmac=19Zst0_IJk18drk4wnCrVvplNIPWto5xfYsSEOTKmZ0",
        "https://i.picsum.photos/id/657/64/64.jpg?hmac=19Zst0_IJk18drk4wnCrVvplNIPWto5xfYsSEOTKmZ0",
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

function setupVertices(scene, vertices, camera) {
    vertices.forEach((element, index) => {
        let x = Math.random() * maxHSpan * 2 - maxHSpan;
        let y = Math.random() * maxHSpan * 2 - maxHSpan;
        let z = Math.random() * maxVSpan * 2 - maxVSpan;

        // const vertex = BABYLON.MeshBuilder.CreateSphere("sphere", {}, scene);
        const options = {
            width: 0.5,
            height: 0.5,
        }
        const vertex = BABYLON.MeshBuilder.CreatePlane("plane", options, scene);

        // Material
        var mat = new BABYLON.StandardMaterial(`vertex-mat-${index}`, scene);
        mat.diffuseTexture = new BABYLON.Texture(element, scene);
        mat.emissiveColor = new BABYLON.Color3.White;
        vertex.material = mat;

        let pivot = new BABYLON.TransformNode("root");
        vertex.parent = pivot;
        vertex.position = new BABYLON.Vector3(x, y, z);
        // vertex.billboardMode = BABYLON.Mesh.BILLBOARDMODE_USE_POSITIONSearch;

        // matrix = camera.getWorldmatrix();
        // const cameraX = camera.position.x + BABYLON.Vector3.TransformCoordinates(local_pos, matrix);


        let randomAxis = new BABYLON.Vector3(Math.random(), Math.random(), Math.random());
        const randomSign = Math.round(Math.random()) * 2 - 1;
        let stepAngle = 0.01;
        console.log(stepAngle);
        pivot.update = () => {
            pivot.rotate(randomAxis, stepAngle * randomSign, BABYLON.Space.WORLD);
            vertex.rotation = camera.rotation;

        }

    });
}

