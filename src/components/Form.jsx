import { Button, Table, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
const { confirm } = Modal;
const Form = () => {
  const { register, handleSubmit,setValue } = useForm();
  const [formData, setFormData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user")) || [];
    setFormData(data);
  }, []);

  const onSubmit = (data) => {
    const existingData = JSON.parse(localStorage.getItem("user")) || [];
    existingData.push(data);

    localStorage.setItem("user", JSON.stringify(existingData));
    setFormData(existingData);
    console.log(formData, "Data saved");
  };
  const deleteUser = (index) => {
    const updatedData = formData.filter((_, i) => i !== index);
    setFormData(updatedData);
    localStorage.setItem("user", JSON.stringify(updatedData));
  };
  const handleDelete = (index) => {
    confirm({
      title: "Are you sure delete?",

      //   content: 'Some descriptions',
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteUser(index);
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };
  const handleUpdate = (index) => {
    setShowModal(true);
    const userToUpdate = formData[index];
    setModalData({ ...userToUpdate, index });
    setValue("name", userToUpdate.name);
    setValue("email", userToUpdate.email);
  };
  const updateData = (data) => {
    const updatedData = formData.map((user, index) => {
      
      if (index === modalData.index) {
        return {
          ...user, 
          name: data.name,
          email: data.email,
        };
      }
      return user;
    });
    setFormData(updatedData);
    localStorage.setItem("user", JSON.stringify(updatedData));
    setShowModal(false);
  };
  
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Action",
      key: "action",
      render: (text, record, index) => (
        <div>
          <Button onClick={() => handleDelete(index)}>Delete</Button>
          <Button onClick={() => handleUpdate(index)}>Update</Button>
        </div>
      ),
    },
  ];
  
  return (
    <div>
      <div className="flex flex-col justify-center items-center h-screen overflow-auto">
        <h1 className="text-black font-bold m-3">Simple Crud Operation </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 border border-black w-72 rounded-md bg-gray-300 p-10"
        >
          <input
            className="border border-gray-600 rounded outline-none p-2"
            type="text"
            {...register("name")}
            placeholder="Enter your Name"
          />
          <input
            className="border border-gray-600 rounded outline-none p-2"
            type="text"
            {...register("email")}
            placeholder="Enter your Password"
          />
          <button className="border border-black p-3 bg-gray-800 text-white mt-3 hover:bg-gray-400"  type="submit">Submit</button>
        </form>
      </div>

      <Table columns={columns} dataSource={formData} className="mx-20 mt-[-20px]" pagination />
      {showModal && (
        <Modal
           
          visible={showModal}
          footer={false}
          onCancel={() => setShowModal(false)}
          style={{
            padding: '10px',
            height:'fit-content'
          }}
        >
          <form onSubmit={handleSubmit(updateData)} className="flex flex-col mt-10">
            <input
              className="border border-gray-600 rounded outline-none p-2 "
              type="text"
              {...register("name", { value: modalData.name })}
              placeholder="Enter your Name"
            />
            <input
              className="border mt-5 border-gray-600 rounded outline-none p-2"
              type="text"
              {...register("email", { value: modalData.email })}
              placeholder="Enter your Password"
            />
            <button type="submit" className="border border-black p-3 bg-gray-800 text-white mt-3 hover:bg-gray-400" >Update</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Form;
