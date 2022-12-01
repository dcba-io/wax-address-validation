import Layout from '../components/Layout';
import { MdDone } from "react-icons/md";

function ConfirmationPage() {
    return (
        <Layout>
            <div className="md:flex md:flex-row justify-center h-screen ">
                <div className="px-16 py-12 md:w-full max-w-lg">
                    <h2 className="font-light text-2xl mb-8">Validate WAX Address</h2>
                    <div className="flex items-center justify-center border h-9 border-light-gray rounded shadow-md">
                        <p className="font-bold">Validation Done</p> <MdDone />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ConfirmationPage;