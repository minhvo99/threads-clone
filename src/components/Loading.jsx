import { motion } from 'framer-motion';

const Loading = () => {
    return (
        <div className='absolute top-0 right-0 bottom-0 left-0 z-10 flex h-full min-h-28 w-full flex-col items-center justify-center'>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
            >
                <div className='border-primary h-10 w-10 rounded-full border-4 border-t-transparent'></div>
            </motion.div>
        </div>
    );
};

export default Loading;
