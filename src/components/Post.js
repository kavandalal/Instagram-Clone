import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Fade, Box } from '@mui/material';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import { Avatar } from '@mui/material';
import { db } from '../db/firebase';
import DeleteIcon from '@mui/icons-material/Delete';

import { collection, serverTimestamp } from 'firebase/firestore';

const modal_style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 'auto',
	minWidth: '80vw',
	bgcolor: 'background.paper',
	boxShadow: 24,
	display: 'flex',
};
function Post({ data, user, postId }) {
	const [comment, setComment] = useState();
	const [singleComment, setSingleComment] = useState('');
	const [modalShow, setModalShow] = useState({ comment: false });
	useEffect(() => {
		if (postId) {
			db.collection('posts')
				.doc(postId)
				.collection('comments')
				.orderBy('timestamp', 'desc')
				.onSnapshot((snapshot) => {
					setComment(snapshot.docs.map((i) => ({ id: i.id, data: i.data() })));
				});
			// .orderBy('timestamp', 'desc')
		}
	}, [postId]);

	const handleCommentSubmit = (e) => {
		e.preventDefault();
		db.collection('posts')
			.doc(postId)
			.collection('comments')
			.add({
				text: singleComment,
				username: user.displayName,
				timestamp: serverTimestamp(),
			})
			.catch((err) => {
				alert(err.message);
				console.log('err ++', err);
			});
		setSingleComment('');
	};

	const handleDeleteComment = (id, i) => {
		db.collection('posts').doc(postId).collection('comments').doc(id).delete();
		// console.log(id, comment[id]);
	};

	return (
		<>
			<Modal
				aria-labelledby='transition-modal-title'
				aria-describedby='transition-modal-description'
				open={modalShow.comment}
				onClose={() => {
					setModalShow((prev) => ({
						...prev,
						comment: false,
					}));
				}}>
				<Fade in={modalShow.comment}>
					<div className=' flex justify-center items-center'>
						<Box sx={modal_style} className='flex-row-to-col box__ht'>
							<div className='w-full md:w-3/5 '>
								<div className='flex justify-center items-center bg-black h-full img__ht'>
									{/* image */}
									<img src={data?.imageUrl} alt='' className='object-contain' style={{ maxHeight: '100%' }} />
								</div>
							</div>
							<div className=' w-full md:w-2/5'>
								<form className='h-full flex flex-col justify-between' onSubmit={handleCommentSubmit}>
									<div>
										<div className='flex items-center px-3 py-2 border border-gray-300'>
											<div className='pr-2'>
												<Avatar
													className='object-contain'
													src='../../public/Avatar-PNG-Image.png'
													sx={{ width: '2.5rem', height: '2.5rem' }}
													variant='circular'
												/>
											</div>
											<span className='font-bold'>{data?.username}</span>
										</div>
										<div className='flex items-center px-4 py-2 '>
											<span className='font-bold'>{data?.username}</span>
											<span className='ml-2'>{data?.caption}</span>
										</div>
									</div>
									<div className='my-1 h-[160px] md:h-full' style={{ overflowY: 'auto' }}>
										{comment &&
											comment.map(({ data, id }, index) => (
												<div key={index} className='flex items-center px-4 py-2'>
													<span className='font-bold '>{data?.username}</span>
													<span className='ml-2'>{data?.text}</span>
													{user && user?.displayName == data?.username && (
														<span className='text-gray-400 cursor-pointer ml-auto' onClick={() => handleDeleteComment(id)}>
															<DeleteIcon />
														</span>
													)}
												</div>
											))}
									</div>
									{user && (
										<div className='flex p-2 w-full'>
											<Input
												name='comment'
												value={singleComment}
												className={'w-full'}
												onChange={(e) => setSingleComment(e.target.value)}
												required
												placeholder='Enter Comment...'
											/>
											<Button type='submit' variant='outlined' style={{ color: 'black', borderColor: 'black' }}>
												Submit
											</Button>
										</div>
									)}
								</form>
							</div>
						</Box>
					</div>
				</Fade>
			</Modal>
			<center>
				<div className='border rounded-lg max-w-md bg-white flex-col flex-grow h-full'>
					<div className='flex items-center px-3 py-2'>
						<div className='pr-2'>
							<Avatar
								className='object-contain'
								src='../../public/Avatar-PNG-Image.png'
								sx={{ width: '2.5rem', height: '2.5rem' }}
								variant='circular'
							/>
						</div>
						<span className='font-bold'>{data?.username}</span>
					</div>
					<div style={{ height: '320px' }}>
						{/* image */}
						<img src={data?.imageUrl} alt='' className='object-content ' style={{ maxHeight: '100%' }} />
					</div>
					<div className='text-left px-3 py-2 flex justify-between'>
						<div>
							<span className='font-bold lowercase pr-2'>{data?.username || 'Name'}</span>

							<span>
								{data?.caption && data?.caption?.length > 20 ? (
									<>
										{data?.caption.substring(0, 20)}{' '}
										<span className='text-gray-400 cursor-pointer' onClick={() => setModalShow((prev) => ({ ...prev, comment: true }))}>
											...more
										</span>
									</>
								) : (
									<>{data?.caption}</>
								)}
							</span>
						</div>
						<div onClick={() => setModalShow((prev) => ({ ...prev, comment: true }))}>
							<MapsUgcOutlinedIcon />
						</div>
					</div>
					{comment && comment.length > 0 && (
						<div className='text-left px-3 pb-4'>
							<span className='text-gray-400  cursor-pointer' onClick={() => setModalShow((prev) => ({ ...prev, comment: true }))}>
								View {comment.length} comments
							</span>
						</div>
					)}
				</div>
			</center>
		</>
	);
}

export default React.memo(Post);
