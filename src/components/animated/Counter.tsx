// Code taken from https://stackoverflow.com/questions/60205544/in-framer-motion-how-to-animate-pure-data-like-a-number-from-0-to-100.

import { animate } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";

const Counter: React.FC<{ from: number; to: number }> = ({ from, to }) => {
    const nodeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const node = nodeRef.current;

        const controls = animate(from, to, {
            duration: 1.5,
            onUpdate(value) {
                if (node) node.textContent = value.toFixed(0);
            },
        });

        return () => controls.stop();
    }, [from, to]);

    return <Box ref={nodeRef} display='inline-block'/>;
};

export default Counter