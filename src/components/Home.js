// to do
// crop image
// styling for grid
//

import React, { useState, useEffect } from 'react';
import Post from './Post.js';
import { Modal, Button, Input } from '@mui/material';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import { db, storage, auth } from '../db/firebase';
import { serverTimestamp } from 'firebase/firestore';
import Footer from './Footer.js';

const modal_style = {
	position: 'absolute',
	top: '35%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	boxShadow: 24,
};

function Home() {
	const [modalShow, setModalShow] = useState({ login: false, upload: false, signup: false });
	const [posts, setPosts] = useState([]);
	const [user, setUser] = useState(null);
	const [inputData, setInputData] = useState({
		file: null,
		caption: '',
		progress: 0,
		email: '',
		username: '',
		password: '',
	});

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				//user login
				setUser(authUser);
				// if (!authUser.displayName) {
				// 	// signup usercreated
				// 	return authUser.updateProfile({
				// 		displayName: inputData.username,
				// 	});
				// }
			} else {
				// user logout
				setUser(null);
			}
		});
		return () => unsubscribe();
	}, [user, inputData.username]);

	useEffect(() => {
		db.collection('posts')
			.orderBy('timestamp', 'desc')
			.onSnapshot((snapshot) => {
				setPosts(
					snapshot.docs.map((i) => ({
						id: i.id,
						post: i.data(),
					}))
				);
			});
		// console.log(db.collection('posts'));
	}, []);

	const handleLogout = () => {
		auth.signOut();
	};

	const handleOpenModal = (name) => {
		setModalShow((prev) => ({ ...prev, [name]: true }));
	};

	const handleFileSubmit = (e) => {
		e.preventDefault();
		const uploadTask = storage.ref(`/images/${inputData.file.name}`).put(inputData.file);
		uploadTask.on(
			'state_changed',
			(snapshot) => {
				// on update

				let currentProgress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setInputData((prev) => ({
					...prev,
					progress: currentProgress,
				}));
			},
			(error) => {
				//on error
				console.log('error ++ ', error);
				alert(error.message);
			},
			() => {
				//on complete
				storage
					.ref('images')
					.child(inputData.file.name)
					.getDownloadURL()
					.then((url) => {
						db.collection('posts').add({
							timestamp: serverTimestamp(),
							caption: inputData.caption,
							imageUrl: url,
							username: user.displayName,
						});
					});
				setInputData((prev) => ({
					...prev,
					caption: '',
					file: null,
					progress: 0,
				}));
				alert('Image was uploaded successfully');
			}
		);
	};

	const handleLoginSubmit = async (e) => {
		e.preventDefault();
		auth
			.signInWithEmailAndPassword(inputData.email, inputData.password)
			.catch((err) => alert(err.message))
			.then(() => {
				setModalShow((prev) => ({
					...prev,
					login: false,
				}));
			});
		setInputData((prev) => ({
			...prev,
			password: '',
			email: '',
		}));
	};

	const handleSignupSubmit = (e) => {
		e.preventDefault();
		auth
			.createUserWithEmailAndPassword(inputData.email, inputData.password)
			.catch((err) => {
				alert(err.message);
			})
			.then((authUser) => {
				return authUser.user.updateProfile({
					displayName: inputData.username,
				});
			});
		setInputData((prev) => ({
			...prev,
			password: '',
			username: '',
			email: '',
		}));
		setModalShow((prev) => ({
			...prev,
			signup: false,
		}));
	};

	const handleFileUpload = (e) => {
		if (e.target.files[0]) {
			setInputData((prev) => ({
				...prev,
				file: e.target.files[0],
			}));
		}
	};

	return (
		<>
			<Modal
				aria-labelledby='transition-modal-title'
				aria-describedby='transition-modal-description'
				open={modalShow.upload}
				onClose={() => {
					setModalShow((prev) => ({
						...prev,
						upload: false,
					}));
				}}>
				<Fade in={modalShow.upload}>
					<form action='' onSubmit={handleFileSubmit}>
						<Box sx={modal_style}>
							<Box className='text-2xl font-bold mb-7 flex justify-center py-4 border-b border-black '>Upload Image </Box>
							<Box className='mx-5 my-2'>
								<progress className='w-full ' value={inputData.progress} max={'100'}></progress>
								{/* <label htmlFor=''>Caption</label> */}
								<Input className='mt-6 w-full' type='file' accept='image/*' onChange={handleFileUpload} required />
								<Input
									className='mt-6 w-full'
									type='text'
									value={inputData.caption}
									placeholder='Enter Caption..'
									onChange={(e) => setInputData((prev) => ({ ...prev, caption: e.target.value }))}
									required
								/>
								<div className='flex justify-end mt-7 mb-4'>
									<div>
										<Button type='submit' variant='contained'>
											Submit
										</Button>
									</div>
								</div>
							</Box>
						</Box>
					</form>
				</Fade>
			</Modal>
			<Modal
				open={modalShow.login}
				onClose={() => {
					setModalShow((prev) => ({
						...prev,
						login: false,
					}));
				}}>
				<Fade in={modalShow.login}>
					<form action='' onSubmit={handleLoginSubmit}>
						<Box sx={modal_style}>
							<Box className='text-2xl font-bold mb-7 flex justify-center py-4 border-b border-black '>Login </Box>
							<Box className='mx-5 my-2'>
								<div className='flex justify-between'>
									<label htmlFor=''>Email</label>
									<Input
										type='text'
										value={inputData.email}
										placeholder='Enter Email..'
										onChange={(e) => setInputData((prev) => ({ ...prev, email: e.target.value }))}
										required
									/>
								</div>
								<div className='mt-6 flex justify-between'>
									<label htmlFor=''>Password</label>
									<Input
										type='password'
										value={inputData.password}
										placeholder='Enter password..'
										onChange={(e) => setInputData((prev) => ({ ...prev, password: e.target.value }))}
										required
									/>
								</div>
								<div className='flex justify-end mt-7 mb-4'>
									<div>
										<Button type='submit' variant='contained'>
											Submit
										</Button>
									</div>
								</div>
							</Box>
						</Box>
					</form>
				</Fade>
			</Modal>
			<Modal
				open={modalShow.signup}
				onClose={() => {
					setModalShow((prev) => ({
						...prev,
						signup: false,
					}));
				}}>
				<Fade in={modalShow.signup}>
					<form action='' onSubmit={handleSignupSubmit}>
						<Box sx={modal_style}>
							<Box className='text-2xl font-bold mb-7 flex justify-center py-4 border-b border-black '>Sign Up</Box>
							<Box className='mx-5 my-2'>
								<div className='flex justify-between '>
									<label htmlFor=''>Username</label>

									<Input
										type='text'
										value={inputData.username}
										placeholder='Enter Username...'
										onChange={(e) => setInputData((prev) => ({ ...prev, username: e.target.value }))}
										required
									/>
								</div>
								<div className='flex justify-between mt-6'>
									<label htmlFor=''>Email</label>
									<Input
										type='text'
										value={inputData.email}
										placeholder='Enter Email..'
										onChange={(e) => setInputData((prev) => ({ ...prev, email: e.target.value }))}
										required
									/>
								</div>
								<div className='flex justify-between mt-6'>
									<label htmlFor=''>Password</label>
									<Input
										type='password'
										value={inputData.password}
										placeholder='Enter password..'
										onChange={(e) => setInputData((prev) => ({ ...prev, password: e.target.value }))}
										required
									/>
								</div>
								<div className='flex justify-end mt-7 mb-4'>
									<div>
										<Button type='submit' variant='contained'>
											Submit
										</Button>
									</div>
								</div>
							</Box>
						</Box>
					</form>
				</Fade>
			</Modal>
			{/* header start */}
			<div className='object-contain flex bg-white h-20 p-2 border-b border-gray-300 justify-between sticky top-0 z-10 px-3 lg:px-40 '>
				<div className='flex '>
					<img
						className='object-contain'
						src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2560px-Instagram_logo.svg.png'
						alt=''
					/>
				</div>
				{user && <div className='text-lg sm:text-2xl flex items-center '>{user.displayName}</div>}
				<div className=' flex items-center gap-4 text-lg sm:text-2xl  '>
					{user ? (
						<>
							<Button
								onClick={() => {
									handleOpenModal('upload');
								}}
								style={{ color: '#222' }}>
								Upload
							</Button>
							<Button onClick={handleLogout} style={{ color: '#222' }}>
								Logout
							</Button>
						</>
					) : (
						<>
							<Button onClick={() => handleOpenModal('login')} style={{ color: '#222' }}>
								Login
							</Button>
							<Button onClick={() => handleOpenModal('signup')} style={{ color: '#222' }}>
								Signup
							</Button>
						</>
					)}
				</div>
			</div>
			{/* header end */}
			{/* body start */}
			<div
				className='
         mx-10 lg:mx-40 mt-5 mb-8'>
				<div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mr-auto ml-auto'>
					{posts.length > 0 && posts.map(({ id, post }) => <Post key={id} postId={id} user={user} data={post} />)}
				</div>
			</div>
			{/* body end */}

			<div>
				<Footer />
			</div>
		</>
	);
}

export default Home;
