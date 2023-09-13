import axios from "axios";
import { useEffect, useState } from "react";
import { Pagination } from "antd";
interface User {
	id: number;
	name: string;
	email: string;
	address: string;
	status: string;
}

function App() {
	const [data, setData] = useState<User[]>([]);
	const [value, setValue] = useState("");
	const [sortValue, setSortValue] = useState();
	console.log("App ~ sortValue >", sortValue);

	const sortOptions = ["name", "address", "email", "status"];

	const url = "http://localhost:3555/users";

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get<User[]>(`${url}?q=${value}`);
				setData(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		// Fetch data initially and whenever the value changes
		fetchData();
	}, [value]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get<User[]>(
					`${url}?_sort=${sortValue}&_order=asc`
				);
				setData(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		// Fetch data initially and whenever the value changes
		fetchData();
	}, [sortValue]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Update the value state as the user types
		setValue(e.target.value);
	};

	const handleSort = (e: any) => {
		const value = e.target.value;
		setSortValue(value);
	};

	const handleFilter = async (value: any) => {
		return await axios
			.get(`${url}?status=${value}`)
			.then((data) => setData(data.data))
			.catch((error) => console.log(error));
	};

	// Pagination functionality

	const [postPerPage, setPostPerPage] = useState(5);
	const [page, setPage] = useState(1);
	const [workers, setWorkers] = useState<any[]>([]);
	const [total, setTotal] = useState<any>("");

	useEffect(() => {
		if (data) {
			setWorkers(data);
			setTotal(data.length);
		}
	}, [data]);
	// Calculate pagination indexes and list of workers for current page

	const indexOfLastPage = postPerPage * page;
	const indexOfFirstPage = indexOfLastPage - postPerPage;
	const listOfWorkers = workers.slice(indexOfFirstPage, indexOfLastPage);
	console.log("TasksPage ~ listOfWorkers >", listOfWorkers);

	const onShowSizeChange = (current: any, pageSize: any) => {
		setPostPerPage(pageSize);
	};

	return (
		<div className="min-h-screen flex ">
			<div className="container mx-auto">
				<h1 className="my-12 font-bold text-[40px]">
					Sort, filter, search
				</h1>
				<div className="flex">
					<form className="sticky top-0 left-0">
						<input
							className="px-4 py-2 border"
							type="text"
							placeholder="Search.."
							value={value}
							onChange={handleInputChange}
						/>
					</form>
					<div>
						Sort by:
						<select value={sortValue} onChange={handleSort}>
							<option value="">Please select</option>
							{sortOptions.map((item: any, i: any) => {
								return (
									<option value={item} key={i}>
										{item}
									</option>
								);
							})}
						</select>
					</div>

					<div>
						<h4>Filter by status:</h4>
						<div className="flex">
							<button
								onClick={() => handleFilter("Active")}
								className="border px-4 py-2 rounded-lg bg-green-500"
							>
								Active
							</button>
							<button
								onClick={() => handleFilter("Inactive")}
								className="border px-4 py-2 rounded-lg bg-red-400"
							>
								Inactive
							</button>
						</div>
					</div>
				</div>
				<table className="min-w-full divide-y divide-gray-200 ">
					<thead>
						<tr>
							<th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
								ID
							</th>
							<th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
								Name
							</th>
							<th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
								Email
							</th>
							<th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
								Address
							</th>
							<th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
								Status
							</th>
						</tr>
					</thead>
					<tbody>
						{listOfWorkers.map((user, i) => (
							<tr key={user.id}>
								<td className="px-6 py-4 whitespace-no-wrap">
									{user.id}
								</td>
								<td className="px-6 py-4 whitespace-no-wrap">
									{user.name}
								</td>
								<td className="px-6 py-4 whitespace-no-wrap">
									{user.email}
								</td>
								<td className="px-6 py-4 whitespace-no-wrap">
									{user.address}
								</td>
								<td className="px-6 py-4 whitespace-no-wrap">
									{user.status}
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<Pagination
					className=""
					showQuickJumper
					onChange={(value: any) => setPage(value)}
					pageSize={postPerPage}
					total={total}
					simple
					onShowSizeChange={onShowSizeChange}
					current={page}
				/>
			</div>
		</div>
	);
}

export default App;
