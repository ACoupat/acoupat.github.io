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

    setupVertices(scene, vertices);


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
}

function setupVertices(scene, vertices) {
    vertices.forEach(element => {
        let x = Math.random() * maxHSpan * 2 - maxHSpan;
        let y = Math.random() * maxHSpan * 2 - maxHSpan;
        let z = Math.random() * maxVSpan * 2 - maxVSpan;

        const vertex = BABYLON.MeshBuilder.CreateSphere("sphere", {}, scene);

        let pivot = new BABYLON.TransformNode("root");
        vertex.parent = pivot;
        vertex.position = new BABYLON.Vector3(x, y, z);

        let randomDuration = Math.random();

        // rotation animations
        const rotX = new BABYLON.Animation("wheelAnimation", "rotation.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        rotX.setKeys([
            { frame: 0, value: 0 },
            { frame: animCycleDuration / randomDuration, value: 2 * Math.PI },
        ])

        const rotY = new BABYLON.Animation("wheelAnimation", "rotation.y", 5, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        rotY.setKeys([
            { frame: 0, value: 0 },
            { frame: animCycleDuration / randomDuration, value: 2 * Math.PI },
        ])

        const rotZ = new BABYLON.Animation("wheelAnimation", "rotation.y", 5, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        rotZ.setKeys([
            { frame: 0, value: 0 },
            { frame: animCycleDuration / randomDuration, value: 2 * Math.PI },
        ])

        pivot.animations = [rotX, rotY, rotZ];
        scene.beginAnimation(pivot, 0, animCycleDuration, true);



    });
}
