class Boy {
    @speak
    run () {
        console.log('I can run!');
    }
}

function speak(target, key, descriptor) {
    console.log(target);
    console.log(key);
    console.log(descriptor);

    return descriptor;
}

const luke  = new Boy();

luke.run();
